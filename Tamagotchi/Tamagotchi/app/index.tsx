import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, Modal, TouchableOpacity, Text, FlatList, TextInput } from 'react-native';
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
  const [modalVisibleD, setModalVisibleD] = useState(false);
  const [modalVisibleE, setModalVisibleE] = useState(false);
  const [name, setName] = useState("");
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
    setModalVisibleD(false); 
  
    const attemptEject = async (id: number) => {
      try {
        setTimeout(async () => {
          setModalVisibleE(true); 
          await new Promise(resolve => setTimeout(resolve, 6000));
          await productDatabase.deleteTamagotchiById(id);
          setTamagochis(prev => prev.filter(t => t.id !== id));
          setEjectId(null);
          setModalVisibleE(false); 
        }, 6000); 
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
  
    await attemptEject(id);
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


  const abrirInput = () => {
    setModalVisibleD(true);
  }
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
  const deleteByName = async (name: string) => {
    const tamagotchiToDelete = tamagochis.find(t => t.name === name);
    if (tamagotchiToDelete) {
      setEjectId(tamagotchiToDelete.id); 
      setModalVisibleE(true);
      setModalVisibleD(false); 
    }
  
    try {
      await productDatabase.deleteTamagotchiByName(name);
      setTamagochis(prev => prev.filter(t => t.name !== name));
      setModalVisibleD(false); 
      setModalVisibleE(false); 
    } catch (error) {
      console.error('Error deleting Tamagotchi:', error);
    }
  };

  const handleDelete = () => {
    setModalVisibleD(false); 
    deleteByName(name);
    setModalVisibleD(false); 
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, { transform: [{ translateX: scrollX }] }]}>
        <Image source={require('../assets/images/backgroundInicial.png')} style={styles.backgroundImage} />
        <Image source={require('../assets/images/backgroundInicial2.png')} style={[styles.backgroundImage, { position: 'absolute', left: '100%' }]} />
      </Animated.View>
      <View style={styles.containerPrincipal}>
        <Text style={styles.Title}>TAMAGOTCHIS</Text>
        <View style={styles.alinhar}>
          <TouchableOpacity style={styles.bttIniciar2} onPress={cadastrar}>
            <Text style={styles.title3}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bttIniciar3} onPress={abrirInput}>
            <Text style={styles.title3}>-</Text>
          </TouchableOpacity>
        </View>
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
                    <Text style={styles.textoEjetar}>EJECT</Text>
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
      <Modal animationType="fade" transparent={true} visible={modalVisibleD} onRequestClose={() => setModalVisibleD(false)}>
        <View style={styles.modal2}>
          <Text style={styles.deletetext}>ENTER TAMAGOTCHI NAME</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Choose your name"
            placeholderTextColor="#FFFF"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.alinharbtt}>
            <TouchableOpacity style={styles.btt} onPress={() => setModalVisibleD(false)}>
              <Text style={styles.text}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btt} onPress={handleDelete}>
              <Text style={styles.text}>Eject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  alinhar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  alinharbtt: {
    flexDirection: 'row',
    width: '100%',
    height: '20%',
    justifyContent: 'space-around',
    top: 120,
  },
  btt: {
    width: '40%',
    height: '100%',
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontFamily: 'Minecraft',
    textAlign: 'center',
    fontSize: 22,
    top: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  textInput: {
    position: 'absolute',
    alignSelf: 'center',
    top: 70,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 5,
    height: '20%',
    width: '60%',
    textAlign: 'center',
    fontFamily: 'Minecraft', color: 'white'
  },
  deletetext: {
    color: 'white',
    fontFamily: 'Minecraft',
    fontSize: 20,
    top: 30,
    textAlign: 'center',
  },
  containerPrincipal: {
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
    paddingBottom: 20,
    marginTop: 20,
  },
  containerProgresso: {
    width: '90%',
    backgroundColor: 'black',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 0.5,
    alignSelf: 'center',
    marginTop:20,
    marginBottom:20,
    flex:1,
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
    marginLeft: 20,
  },
  alinharNS: {
    zIndex: 2,
    top:5,
    alignSelf: 'center',
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
    height: '50%',
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
  modal2: {
    width: '90%',
    height: '25%',
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
  bttIniciar3: {
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
  tamagochiName: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Minecraft',
    alignSelf: 'center',
    top:-20,
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
    height: '100%',
    resizeMode: 'center',
    backgroundColor: 'black',
    top:-20,

  },
  tamagochiStatus: {
    fontFamily: 'Minecraft',
    textAlign: 'center',
    top:-15,
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
