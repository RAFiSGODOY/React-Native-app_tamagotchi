import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useProgress } from '../../components/Progresso';
import { BackHandler } from 'react-native';
import ProgressBar from '../../components/BarradeProgresso';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProductDatabase, ProductDatabase } from '../../app/database/Service';

type NavigationProps = NavigationProp<any>;

export default function Comer() {
  const navigation = useNavigation<NavigationProps>();
  const { hunger, sleep, fun, status, setInitialValues } = useProgress();
  const [name, setName] = useState<string>('');
  const [nameT, setNameT] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [coins, setCoin] = useState<number>();
  const productDatabase = useProductDatabase();
  const { incrementHunger, incrementSleep, incrementFun } = useProgress();
  const [tamagotchi, setTamagotchi] = useState<ProductDatabase | null>(null);
  const [tamagochiId, setTamagochiId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleF, setModalVisibleF] = useState(false);
  const [voltar, setVoltar] = useState(false);
  const [textoModal, setTextoModal] = useState("");
  const [textoModalF, setTextoModalF] = useState("");
  const [TomogochiImage, setTomogochiImage] = useState<any>(null);


  const getTamagochiId = async () => {
    try {
      const id = await AsyncStorage.getItem('tamagochiId');
      if (id !== null) {
        setTamagochiId(Number(id));
      }
    } catch (error) {
      console.error('Erro ao ler Tamagotchi ID:', error);
    }
  };
  async function TrazerDados() {
    try {
      if (tamagochiId) {
        const data = await productDatabase.getTamagotchiById(tamagochiId);
        if (data) {
          setNameT(data.name);
          setCoin(data.coin);
          setTipo(data.tipo);
          setInitialValues({
            hunger: data.hunger ?? 100,
            sleep: data.sleep ?? 100,
            fun: data.fun ?? 100,
          });
           console.log(data.image)
        }
      }
    } catch (error) {
      console.error("Error fetching Tamagotchi name:", error);
    }
  }
  useEffect(() => {
    getTamagochiId();
  }, []);

  useEffect(() => {
    TrazerDados();
  }, [tamagochiId]);


  const irDormir = () => {
    navigation.navigate('Dormir')
  }
  const irComer = () => {
    navigation.navigate('Comer')
  }
  const irJogar = () => {
    navigation.navigate('Jogar')
  }


  const calculateStatus = () => {
    if (status <= 50) return { text: 'DEAD', color: '#ff0000' };
    if (status <= 100) return { text: 'CRITICAL', color: '#ff0000' };
    if (status <= 150) return { text: 'VERY SAD', color: '#ffff00' };
    if (status <= 200) return { text: 'SAD', color: '#ffff00' };
    if (status <= 250) return { text: 'GOOD', color: '#00ff6e' };
    return { text: 'VERY GOOD', color: '#00ff6e' };
  };

  const { text: statusText, color: statusColor } = calculateStatus();
  useEffect(() => {
    const backAction = () => {
      setModalVisible(true);
      setTextoModal("Do you really want to leave?");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleExit = () => {
    saveData();
    navigation.goBack();
  };
  const handleExit2 = () => {
    saveData();
    navigation.navigate('Jogar');
  };
  const closeModal = () => setModalVisible(false);
  const closeModal2 = () => setModalVisibleF(false);
  const close = () => {
    setModalVisible(false)
  }
  const saveData = async () => {
    try {
      const statusnew = (hunger ?? 0) + (sleep ?? 0) + (fun ?? 0);
      if (tamagochiId !== null) {
        await productDatabase.updateTamagotchi(tamagochiId, {
          coin: coins ?? 0,
          hunger: hunger ?? 100,
          sleep: sleep ?? 100,
          fun: fun ?? 100,
          status: statusnew,
        });
        console.log('Dados salvos com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
    }
  };
  useEffect(() => {
    let image;
    switch (tipo) {
      case 'cat01':
        image = require('../../assets/images/amongpretoanimado.gif');
        break;
      case 'cat02':
        image = require('../../assets/images/amongvermelhoanimado.gif');
        break;
      case 'cat03':
        image = require('../../assets/images/amongazulanimado.gif');
        break;
      case 'cat04':
        image = require('../../assets/images/amongamareloanimado.gif');
        break;
      default:
        image = null;
    }
    setTomogochiImage(image);
  }, [productDatabase]);

  const purchaseFood = (foodCost: number) => {
    if (coins && coins >= foodCost) {
      setCoin(coins - foodCost);
      incrementHunger(5);
    } else {
      setModalVisibleF(true);
      setTextoModalF("You need more coins to buy")
    }
  };
  const purchaseFood2 = (foodCost: number) => {
    if (coins && coins >= foodCost) {
      setCoin(coins - foodCost);
      incrementHunger(10);
    } else {
      setModalVisibleF(true);
      setTextoModalF("You need more coins to buy")
    }
  };
  const purchaseFood3 = (foodCost: number) => {
    if (coins && coins >= foodCost) {
      setCoin(coins - foodCost);
      incrementHunger(2);
    } else {
      setModalVisibleF(true);
      setTextoModalF("You need more coins to buy")
    }
  };
  const purchaseFood4 = (foodCost: number) => {
    if (coins && coins >= foodCost) {
      setCoin(coins - foodCost);
      incrementHunger(1);
    } else {
      setModalVisibleF(true);
      setTextoModalF("You need more coins to buy")
    }
  };
  


  return (
    <View style={styles.container}>

      <View style={styles.containerProgresso}>
        <View style={styles.Hunger}>
          <Text style={styles.HungerText}>
            HUNGER
          </Text>
          <View style={styles.HungerProgress}>
            <ProgressBar progress={hunger} width={100} height={12} />
            <Text style={styles.teste}>{hunger}%</Text>
          </View>
          <Image
            source={require('../../assets/images/peixeAtivado.png')}
            style={styles.iconPeixeProgress}
          />
        </View>
        <View style={styles.Sleep}>
          <Image
            source={require('../../assets/images/luaAtivada.png')}
            style={styles.iconLuaProgress}
          />
          <Text style={styles.SleepText}>
            SLEEP
          </Text>
          <View style={styles.SleepProgress}>
            <ProgressBar progress={sleep} width={100} height={12} />
            <Text style={styles.teste}>{sleep}%</Text>
          </View>

        </View>
        <View style={styles.Fun}>
          <Text style={styles.FunText}>
            FUN
          </Text>
          <View style={styles.FunProgress}>
            <ProgressBar progress={fun} width={100} height={12} />
            <Text style={styles.teste}>{fun}%</Text>
          </View>
          <Image
            source={require('../../assets/images/controleAtivado.png')}
            style={styles.iconControleProgress}
          />
        </View>
        <View style={styles.Status}>
          <Text style={styles.StatusText}>STATUS</Text>
          <Text style={[styles.Estado, { color: statusColor }]}>{statusText}</Text>
        </View>

      </View>
      <View style={styles.containerPrincipal}>
        <View style={styles.iconCoinContainer} >
          <Image
            source={require('../../assets/images/Coin.png')}
            style={styles.iconCoin}
          />
          <Text style={styles.textCoin}>
            {coins}
          </Text>
        </View>
        <View style={styles.backname}>
          <Text style={styles.informaname}>
            NAME YOUR TAMAGOTCHI
          </Text>
          <Text>
            <View style={styles.AjusteName}>
              <Text style={styles.nameinformado}>
                {nameT}
              </Text>
            </View>
          </Text>
        </View>
        <View style={styles.eject}>
          {TomogochiImage && (
            <Image
              source={TomogochiImage}
              style={styles.containerimagem}
            />
          )}
        </View>
        <TouchableOpacity style={styles.Comida01} onPress={() => purchaseFood(4)}>
          <Image
            source={require('../../assets/images/soft_drink_red.png')}
            style={styles.iconComida01}
          />
          <View style={styles.iconTXT}>
            <Text style={styles.textoComida01}>4</Text>
            <Image
              source={require('../../assets/images/Coin.png')}
              style={styles.iconCoinFood}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Comida02} onPress={() => purchaseFood2(8)}>
          <Image
            source={require('../../assets/images/bacon.png')}
            style={styles.iconComida01}
          />
          <View style={styles.iconTXT}>
            <Text style={styles.textoComida01}>8</Text>
            <Image
              source={require('../../assets/images/Coin.png')}
              style={styles.iconCoinFood}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Comida03} onPress={() => purchaseFood3(1)}>
          <Image
            source={require('../../assets/images/cabbage.png')}
            style={styles.iconComida01}
          />
          <View style={styles.iconTXT}>
            <Text style={styles.textoComida01}>1</Text>
            <Image
              source={require('../../assets/images/Coin.png')}
              style={styles.iconCoinFood}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Comida04} onPress={() => purchaseFood4(2)}>
          <Image
            source={require('../../assets/images/white_cheese.png')}
            style={styles.iconComida01}
          />
          <View style={styles.iconTXT}>
            <Text style={styles.textoComida01}>2</Text>
            <Image
              source={require('../../assets/images/Coin.png')}
              style={styles.iconCoinFood}
            />
          </View>

        </TouchableOpacity>
      </View>
      <View style={styles.estilotab}>
        <TouchableOpacity style={styles.bttPeixe} onPress={irComer} >
          <Image
            source={require('../../assets/images/peixeAtivado.png')}
            style={styles.iconPeixe}
          />
          <Text style={styles.textoIcone}>EAT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bttControle} onPress={irJogar}>
          <Image
            source={require('../../assets/images/controleDesativado.png')}
            style={styles.iconControle}
          />
          <Text style={styles.textoIcone2}>FUN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bttLua} onPress={irDormir}>
          <Image
            source={require('../../assets/images/luaDesativada.png')}
            style={styles.iconLua}
          />
          <Text style={styles.textoIcone3}>ROOM</Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={close}>
        <View style={styles.modal}>
          <Text style={styles.Errotext}>{textoModal}</Text>
          <View style={styles.alinharmodal}>
            <TouchableOpacity style={styles.closemodal} onPress={handleExit}>
              <Text style={styles.closemodaltext2}>Exit and save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.staymodal} onPress={closeModal}>
              <Text style={styles.closemodaltext}>to stay</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={modalVisibleF} onRequestClose={close}>
        <View style={styles.modal2}>
          <Text style={styles.Errotext}>{textoModalF}</Text>
          <View style={styles.alinharmodal}>
            <TouchableOpacity style={styles.closemodal} onPress={closeModal2}>
              <Text style={styles.closemodaltext2}>to close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.staymodal} onPress={handleExit2}>
              <Text style={styles.closemodaltext}>get more</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  iconTXT: {
    flexDirection: 'row-reverse',
    backgroundColor: 'black',
    borderRadius: 5,
    padding:5,
  },
  iconCoinFood:{
    width: '50%',
    height: '100%',
    resizeMode:'contain',
    
  },
  teste:{
   color:'white',
   position:'absolute',
   top:-3,
   right:-12,
   fontSize:12,
   width:'25%',
  },
  Comida01: {
    position: 'absolute',
    width: '14%',
    height: '10%',
    zIndex: 5,
    bottom: 60,
    left: 20,
  },
  Comida02: {
    position: 'absolute',
    width: '14%',
    height: '10%',
    zIndex: 5,
    bottom: 55,
    left: 120,
  },
  Comida03: {
    position: 'absolute',
    width: '14%',
    height: '10%',
    zIndex: 5,
    bottom: 60,
    left: 220,
  },
  Comida04: {
    position: 'absolute',
    width: '14%',
    height: '10%',
    zIndex: 5,
    bottom: 55,
    left: 320,
  },
  iconComida01: {
    backgroundColor: 'black',
    alignSelf: 'center',
    width: '100%',
    height: '100%',

  },
  textoComida01: {
    textAlign: 'left',
    color: 'yellow',
    marginRight:5,
    marginLeft:5,
    fontSize:18,
  },
  eject: {
    width: '75%',
    height: '65%',
    zIndex: 5,
  },
  containerimagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    padding: 20,
  },
  iconCoin: {
    width: '100%',
    resizeMode: 'contain',
    height: '100%',
  },
  textCoin: {
    color: 'yellow',
    backgroundColor: 'black',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 2,
    textAlign: 'center',
    bottom: 10,

  },

  iconCoinContainer: {
    width: '15%',
    height: '15%',
    position: 'absolute',
    top: -10,
    right: 40,

  },
  textoIcone: {
    color: 'white',
    fontFamily: 'Minecraft',
    marginLeft: 10,
    width: '100%',
  },
  AjusteName: {
    alignSelf: 'center',
  },
  informaname: {
    color: 'white',
    fontFamily: 'Minecraft',
    textAlign: 'left',
    marginBottom: 10,
  },
  nameinformado: {
    color: 'white',
    fontFamily: 'Minecraft',
    fontSize: 31,
    width: '100%',
  },
  textoIcone2: {
    color: '#6d6d6d',
    fontFamily: 'Minecraft',
    marginLeft: 10,
    width: '100%',
  },
  textoIcone3: {
    color: '#6d6d6d',
    fontFamily: 'Minecraft',
    marginLeft: 4,
    width: '100%',

  },
  bttPeixe: {
    width: '13%',
    height: '80%',
    marginRight: 50,
    marginLeft: 50,
    marginTop: 0,
  },
  bttControle: {
    width: '13%',
    height: '80%',
    marginRight: 50,
    marginLeft: 20,
    marginTop: 0,
  },
  bttLua: {
    width: '13%',
    height: '80%',
    marginRight: 50,
    marginLeft: 20,
    marginTop: 0,
  },
  iconPeixe: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  iconLua: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  iconControle: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  iconControleProgress: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: 160,
  },
  iconLuaProgress: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: 160,
  },
  iconPeixeProgress: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: 160,
  },
  estilotab: {
    width: '100%',
    height: '10%',
    backgroundColor: 'black',
    borderColor: 'white',
    borderTopWidth: 2,
    bottom: 0,
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  Estado: {
    width: '120%',
    textAlign: 'center',
    fontFamily: 'Minecraft',
    fontSize: 18,
  },
  Status: {
    flexDirection: 'column',
    position: 'absolute',
    right: 0,
    marginRight: 20,

  },
  StatusText: {
    color: 'white',
    fontFamily: 'Minecraft',
    width: '120%',
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 18,
  },
  containerProgresso: {
    top: 60,
    justifyContent: 'center',
    zIndex: 1,
    height: '12%',
    width: '95%',
    backgroundColor: 'black',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 2,
    alignSelf: 'center',
    padding: 5,

  },
  backname: {
    top: 10,
    left: 10,
    zIndex: 1,
    position: 'absolute',
    width: '60%',
    backgroundColor: 'black',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 2,
    padding: 10,
  },
  Hunger: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 7,
  },
  HungerText: {
    color: 'white',
    width: '18%',
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 35,
    fontFamily: 'Minecraft'
  },
  HungerProgress: {
    top: 5,
  },
  Fun: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 7,
  },

  FunText: {
    color: 'white',
    width: '18%',
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 35,
    fontFamily: 'Minecraft'
  },
  FunProgress: {
    top: 5,
  },
  Sleep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  SleepText: {
    color: 'white',
    width: '18%',
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 35,
    fontFamily: 'Minecraft'
  },
  SleepProgress: {
    top: 5,
  },
  containerPrincipal: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    width: '100%',
    height: '72%',
    marginTop: 65,
    //backgroundColor:'white'
  },
  notifications: {
    width: '100%',
    height: '15%',
    position: 'absolute',
    zIndex: 10,
    top: 30,
  },
  modal: {
    width: '90%',
    height: '20%',
    backgroundColor: 'black',
    top: 300,
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 2,
    left: 20,
  },
  modal2: {
    width: '90%',
    height: '20%',
    backgroundColor: 'black',
    top: 300,
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 2,
    left: 20,
  },
  alinharmodal: {
    flexDirection: 'row',
    width: "100%",
    height: '50%',
    justifyContent: 'space-around'
  },
  closemodal: {
    backgroundColor: 'red',
    width: '45%',
    height: '60%',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,

  },
  staymodal: {
    backgroundColor: '#00ff6e',
    width: '45%',
    height: '60%',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
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
    justifyContent: 'center',
    fontFamily: 'Minecraft',
    color: 'white',
    fontSize: 18,
    textTransform: 'uppercase'
  },
  closemodaltext2: {
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: 'Minecraft',
    color: 'white',
    fontSize: 18,
    textTransform: 'uppercase'
  },
});
