import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, Modal, TouchableOpacity, Text, FlatList } from 'react-native';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useProductDatabase } from '../app/database/Service';
import { useProgress } from '../components/Progresso';
import ProgressBar from '../components/BarradeProgresso';
import AsyncStorage from '@react-native-async-storage/async-storage';


type NavigationProps = NavigationProp<any>;

type Tamagochi = {
  id: number;
  name: string;
  tipo: string;
  coin: number;
  fun: number;
  hunger: number;
  sleep: number;
  status: number;
  image: string;
};

export default function Welcome() {
  const navigation = useNavigation<NavigationProps>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [hasTamagochi, setHasTamagochi] = useState(false);
  const productDatabase = useProductDatabase();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleE, setModalVisibleE] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [tamagochis, setTamagochis] = useState<Tamagochi[]>([]);
  const [ejectId, setEjectId] = useState<number | null>(null);

  const getStatusText = (status: number) => {
    if (status === 0) return 'DEAD';
    if (status <= 50) return 'CRITICAL';
    if (status <= 100) return 'VERY SAD';
    if (status <= 150) return 'SAD';
    if (status <= 200) return 'OK';
    if (status <= 250) return 'GOOD';
    return 'VERY GOOD';
  };
  const ejectTamagotchi = async (id: number) => {
    setEjectId(id);
    setModalVisibleE(true);


    const attemptEject = async (id: number) => {
      try {
        await productDatabase.deleteTamagotchiById(id);
        setTamagochis(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        if (error instanceof Error && error.message.includes("database is locked")) {
          console.log("Database is locked, retrying...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          await attemptEject(id);
        } else {
          console.error('Erro ao ejetar Tamagotchi:', error);
        }
      }
    };

    setTimeout(async () => {
      await attemptEject(id);
      setEjectId(null);
      setModalVisibleE(false);
    }, 5000);
  };



  const getColor = (status: number) => {
    if (status <= 50) return '#ff0000';
    if (status <= 150) return '#ffff00';
    return '#00ff6e';
  };
  const storeTamagochiId = async (id: number) => {
    try {
      await AsyncStorage.setItem('tamagochiId', id.toString());
      console.log(`Tamagochi ID ${id} armazenado.`);
    } catch (error) {
      console.error('Erro ao armazenar Tamagotchi ID:', error);
    }
  };

  useEffect(() => {
    async function checkTamagochi() {
      const tamagochisData = await productDatabase.getAllData() as Tamagochi[];
      setTamagochis(tamagochisData);
      setHasTamagochi(tamagochisData.length > 0);
    }
    checkTamagochi();
  }, [productDatabase]);

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.timing(scrollX, {
        toValue: -560,
        duration: 14000,
        useNativeDriver: true,
      }),
      Animated.timing(scrollX, {
        toValue: -960,
        duration: 14000,
        useNativeDriver: true,
      }),
      Animated.timing(scrollX, {
        toValue: -1160,
        duration: 14000,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(animationSequence).start();
  }, [scrollX]);



  const cadastrar = () => {
    navigation.navigate('cadastrar');
  };
  const renderEjectAnimation = (tipo: string) => {
    switch (tipo) {
      case 'cat01':
        return <Image source={require('../assets/images/pretoejetado.gif')} style={styles.eject} />;
      case 'cat02':
        return <Image source={require('../assets/images/vermelhoejetado.gif')} style={styles.eject} />;
      case 'cat03':
        return <Image source={require('../assets/images/azulejetado.gif')} style={styles.eject} />;
      case 'cat04':
        return <Image source={require('../assets/images/amareloejetado.gif')} style={styles.eject} />;
      default:
        return null;
    }
  };
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, { transform: [{ translateX: scrollX }] }]}>
        <Image source={require('../assets/images/backgroundInicial.png')} style={styles.backgroundImage} />
        <Image source={require('../assets/images/backgroundInicial2.png')} style={[styles.backgroundImage, { position: 'absolute', left: '100%' }]} />
      </Animated.View>
      <View style={styles.containerPrincipal}>
        <Text style={styles.Title}>TAMAGOTCHIS</Text>
        <TouchableOpacity style={styles.bttIniciar2} onPress={cadastrar}>
          <Text style={styles.title3}>+</Text>
        </TouchableOpacity>
        <ScrollView style={styles.scroll}>
          {tamagochis.map((item) => {
            const statusText = getStatusText(item.status);
            const textColor = getColor(item.status);
            let imageSource;

            if (item.status === 0) {
              switch (item.image) {
                case 'cat01':
                  imageSource = require('../assets/images/pretodead.png');
                  break;
                case 'cat02':
                  imageSource = require('../assets/images/vermelhodead.png');
                  break;
                case 'cat03':
                  imageSource = require('../assets/images/azuldead.png');
                  break;
                case 'cat04':
                  imageSource = require('../assets/images/amarelodead.png');
                  break;
                default:
                  imageSource = null;
              }
            } else {
              switch (item.image) {
                case 'cat01':
                  imageSource = require('../assets/images/amongpretoanimado.gif');
                  break;
                case 'cat02':
                  imageSource = require('../assets/images/amongvermelhoanimado.gif');
                  break;
                case 'cat03':
                  imageSource = require('../assets/images/amongazulanimado.gif');
                  break;
                case 'cat04':
                  imageSource = require('../assets/images/amongamareloanimado.gif');
                  break;
                default:
                  imageSource = null;
              }
            }


            return (
              <TouchableOpacity
                key={item.id}
                style={styles.containerProgresso}
                onPress={() => {
                  storeTamagochiId(item.id);
                  navigation.navigate('(tabs)', { tamagochiId: item.id });
                }}>
                <View key={item.id}>
                  <View style={styles.alinharcontainer2}>
                    <View style={styles.containerImage}>
                      <Image source={imageSource} style={styles.tamagochiImage} />
                      <View style={styles.alinharNS}>
                        <Text style={styles.tamagochiName}>{item.name}</Text>
                        <Text style={[styles.tamagochiStatus, { color: textColor }]}>{statusText}</Text>
                      </View>
                    </View>
                    <View>
                      <View style={styles.alinharCoin}>
                        <Image source={require('../assets/images/Coin.png')} style={styles.iconControleProgress} />
                        <Text style={styles.tamagochiCoins}>{item.coin}</Text>
                      </View>
                      <View style={styles.alinharcontainer}>
                        <Image source={require('../assets/images/controleAtivado.png')} style={styles.iconControleProgress} />
                        <View style={styles.alinharbarra}>
                          <ProgressBar progress={item.fun} width={100} height={12} />
                        </View>

                      </View>
                      <View style={styles.alinharcontainer}>
                        <Image source={require('../assets/images/peixeAtivado.png')} style={styles.iconControleProgress} />
                        <View style={styles.alinharbarra}>
                          <ProgressBar progress={item.hunger} width={100} height={12} />
                        </View>

                      </View>
                      <View style={styles.alinharcontainer}>
                        <Image source={require('../assets/images/luaAtivada.png')} style={styles.iconControleProgress} />
                        <View style={styles.alinharbarra}>
                          <ProgressBar progress={item.sleep} width={100} height={12} />
                        </View>

                      </View>
                    </View>
                  </View>
                </View>
                {item.status === 0 && (
                  <TouchableOpacity
                    style={styles.bttEjetar}
                    onPress={() => ejectTamagotchi(item.id)}
                  >
                    <Text style={styles.textoEjetar}>EJETAR</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisibleE} onRequestClose={() => setModalVisibleE(false)}>
        <View style={styles.modal}>
          {ejectId !== null && renderEjectAnimation(tamagochis.find(t => t.id === ejectId)?.tipo || '')}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  containergif: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  eject: {
    width: '100%',
    height: '100%',
  },
  bttEjetar: {
    width: '20%',
    height: '20%',
    backgroundColor: 'red',
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 5,
    position: 'absolute',
    bottom: -10,
    right: 5,
    zIndex: 10,
  },
  textoEjetar: {
    width: '100%',
    color: 'white',
    fontFamily: 'Minecraft',
    textAlign: 'center',
    paddingTop: 5,
  },
  alinharcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    left: 20,
  },
  scroll: {
    width: '100%',
    flexGrow: 1,
    paddingBottom: 20,
  },
  alinharCoin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 15,
    left: 20,
  },
  alinharcontainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 20,
    top: 0,
  },
  alinharNS: {
    zIndex: 2,
    top: 10,
    alignSelf: 'center',
    alignContent: 'center',

  },
  alinharbarra: {
    top: 5,
  },
  iconControleProgress: {
    resizeMode: 'contain',
    width: '15%',
    height: '100%',
    right: 10,

  },
  containerImage: {
    width: '30%',
    height: '100%',
    top: 10,
  },
  modal: {
    width: '90%',
    height: '20%',
    backgroundColor: '#1e1e1e',
    top: 300,
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 2,
    left: 20,
  },
  closemodal: {
    backgroundColor: 'red',
    width: '7%',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
    position: 'absolute',
    left: '90%',
    top: 7,
    zIndex: 10,
  },
  Errotext: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Minecraft',
    padding: 15,
    fontSize: 32,
  },
  closemodaltext: {
    textAlign: 'center',
    fontFamily: 'Minecraft',
    color: 'white',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '100%',
  },
  backgroundImage: {
    width: '90%',
    height: '100%',
    marginTop: 70,
  },
  Title: {
    fontFamily: 'Minecraft',
    fontSize: 45,
    marginTop: 100,
    color: '#ffff',
    backgroundColor: 'black',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 2,
    padding: 12,
    paddingTop: 20,
  },
  containerPrincipal: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  bttIniciar: {
    width: '34%',
    alignContent: 'center',
    marginTop: 200,
    backgroundColor: 'black',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 2,
  },
  bttIniciar2: {
    width: '40%',
    alignContent: 'center',
    marginTop: 50,
    backgroundColor: 'black',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 0.5,
    padding: 10,
  },
  tamagochiList: {
    marginTop: 10,
    width: '90%',

  },
  containerProgresso: {
    justifyContent: 'center',
    zIndex: 1,
    width: '90%',
    backgroundColor: 'black',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 0.5,
    alignSelf: 'center',
    padding: 5,
    height: '20%',
    marginBottom: 10,
    marginTop: 10,

  },
  tamagochiName: {
    color: '#fff',
    fontSize: 12,
    width: '100%',
    fontFamily: 'Minecraft',
    alignSelf: 'center',
    bottom: 2,
  },
  tamagochiCoins: {
    color: 'yellow',
    fontSize: 16,
    fontFamily: 'Minecraft',
    top: 2
  },
  tamagochiFun: {
    color: '#ccc',
    fontSize: 16,
  },
  tamagochiHunger: {
    color: '#ccc',
    fontSize: 16,
  },
  tamagochiSleep: {
    color: '#ccc',
    fontSize: 16,
  },
  tamagochiImage: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    backgroundColor: 'black',

  },
  tamagochiStatus: {
    fontFamily: 'Minecraft',
    textAlign: 'center',
  },
  title3: {
    fontSize: 32,
    color: 'white',
    fontFamily: 'Minecraft',
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },

});
