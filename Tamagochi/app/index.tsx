import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

type NavigationProps = NavigationProp<any>;

export default function Welcome() {
  const navigation = useNavigation<NavigationProps>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const handleStartPress = () => {
    navigation.navigate('(tabs)'); 
  };
  const handleCadPress = () => {
    navigation.navigate('cadastrar'); 
  };
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scrollX, {
          toValue: -360,
          duration: 14000,
          useNativeDriver: true,
        }),
        Animated.timing(scrollX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scrollX]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backgroundContainer,
          {
            transform: [{ translateX: scrollX }],
          },
        ]}
      >
        <Image
          source={require('../assets/images/background.png')}
          style={styles.backgroundImage}
        />
        <Image
          source={require('../assets/images/background.png')}
          style={[styles.backgroundImage, { position: 'absolute', left: '100%' }]}
        />
      </Animated.View>
      <View style={styles.containerPrincipal}>
        <Image
      
          source={require('../assets/images/Logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity style={styles.botaoiniciar} onPress={handleStartPress}>
          <Image
            source={require('../assets/images/BttIniciar.png')}
            style={styles.bttIniciar2}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cadastrar}  onPress={handleCadPress}>
          <Image
            source={require('../assets/images/cadastrar.png')}
            style={styles.bttIniciar}
          />
        </TouchableOpacity>
        <Image
          source={require('../assets/images/versao.png')}
          style={styles.versao}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  containerPrincipal: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    width: '100%',
    height: '90%',
  },
  botaoiniciar: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 11,
    width: '100%',
    height: '19%',
  },
  cadastrar: {
    zIndex: 12,
    width: '100%',
    position: 'relative',
    height: '16%',
    marginTop: -80,
  },
  logo: {
    width: '100%',
    height: '90%',
    position: 'absolute',
    zIndex: 10,
  },
  bttIniciar: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 10,
  },
  bttIniciar2: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 10,
  },
  versao: {
    width: '100%',
    height: '95%',
    position: 'absolute',
    zIndex: 10,
  },
});

