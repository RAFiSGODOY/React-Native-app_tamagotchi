import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, TouchableOpacity, Easing, Text, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

type NavigationProps = NavigationProp<any>;

export default function Cadastrar() {
    const navigation = useNavigation<NavigationProps>();
    const [selectedTomogochi, setSelectedTomogochi] = useState<string | null>(null);
    const rotation = useRef(new Animated.Value(0)).current;
    const scrollX = useRef(new Animated.Value(0)).current;
    const animation = useRef<Animated.CompositeAnimation | null>(null);
    const [selectedTomogochiImage, setSelectedTomogochiImage] = useState<any>(null);
    const [color, setColor] = useState('black');
    const [textoModal, setTextoModal] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const handleCadPress = () => {
        if (selectedTomogochi) {
            navigation.navigate('escolhername', { tomogochi: selectedTomogochi });
            console.log(selectedTomogochi)
        } else {
            setModalVisible(true)
            setTextoModal("Please choose a tamagotchi")
        }
    };
    const handleTomogochiSelect = (type: string) => {
        let image;
        switch (type) {
            case 'cat01':
                image = require('../assets/images/AmongPreto.png');
                break;
            case 'cat02':
                image = require('../assets/images/AmongVermelho.png');
                break;
            case 'cat03':
                image = require('../assets/images/AmongAzul.png');
                break;
            case 'cat04':
                image = require('../assets/images/AmongAmarelo.png');
                break;
            default:
                image = null;
        }
        setSelectedTomogochi(type);
        setSelectedTomogochiImage(image);
    };
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
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
            ])
        ).start();
    }, [scrollX]);

    const close = () => {
        setModalVisible(false)
    }
    useEffect(() => {
        if (selectedTomogochi) {
            animation.current = Animated.loop(
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 8000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })

            );
            animation.current.start();
        } else {
            rotation.setValue(0);
        }

        return () => {
            if (animation.current) {
                animation.current.start();
            }
        };
    }, [selectedTomogochi]);

    const rotateInterpolation = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    const imagePosition = (type: string) => {
        switch (type) {
            case 'cat01':
                return { left: 47, bottom: 410 };
            case 'cat02':
                return { left: 215, bottom: 407 };
            case 'cat03':
                return { left: 50, bottom: 247 };
            case 'cat04':
                return { left: 214, bottom: 247 };
            default:
                return { left: 0, bottom: 0 };
        }
    };

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
                    source={require('../assets/images/backgroundInicial.png')}
                    style={styles.backgroundImage}
                />
                <Image
                    source={require('../assets/images/backgroundInicial.png')}
                    style={[styles.backgroundImage, { position: 'absolute', left: '100%' }]}
                />
                <Image
                    source={require('../assets/images/backgroundInicial.png')}
                    style={styles.backgroundImage}
                />
               
            </Animated.View>
            <View style={styles.containerPrincipal}>
                <Text style={styles.Title}> SELECT YOUR TAMAGOTCHI</Text>
                <View style={styles.containerPrincipal}>
                    {selectedTomogochi && (
                        <Animated.Image
                            style={[
                                styles.Selecionado,
                                {
                                    transform: [{ rotate: rotateInterpolation }],
                                    position: 'absolute',
                                    left: imagePosition(selectedTomogochi).left,
                                    bottom: imagePosition(selectedTomogochi).bottom,
                                    zIndex: 11,
                                },
                            ]}
                        />
                    )}
                    <TouchableOpacity style={styles.EscolherCat} onPress={() => handleTomogochiSelect('cat01')} >
                        <Image
                            source={require('../assets/images/AmongPreto.png')}
                            style={styles.GochiCat}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.EscolherDog} onPress={() => handleTomogochiSelect('cat02')} >
                        <Image
                            source={require('../assets/images/AmongVermelho.png')}
                            style={styles.GochiDog}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.EscolherRato} onPress={() => handleTomogochiSelect('cat03')}>
                        <Image
                            source={require('../assets/images/AmongAzul.png')}
                            style={styles.GochiRato}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.EscolherPassaro} onPress={() => handleTomogochiSelect('cat04')}  >
                        <Image
                            source={require('../assets/images/AmongAmarelo.png')}
                            style={styles.GochiPassaro}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.ProximoPasso} onPress={(handleCadPress)} >
                        <Text style={styles.ProximoPassoText}> NEXT </Text>
                    </TouchableOpacity>


                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}

                    onRequestClose={() => {
                        setModalVisible(!modalVisible);

                    }}>
                    <View style={styles.modal}>
                        <View>
                            <TouchableOpacity style={styles.closemodal} onPress={(close)}>
                                <Text style={styles.closemodaltext}>X</Text>
                            </TouchableOpacity>
                            <Text style={styles.Errotext}>{textoModal}</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        width: '90%',
        height: '20%',
        backgroundColor: '#1e1e1e',
        top: 300,
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 2,
        left: 20
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
        marginTop:30,
        fontSize: 32,

    },
    closemodaltext: {
        textAlign: 'center',
        fontFamily: 'Minecraft',
        color: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        overflow: 'hidden',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '90%',
        resizeMode: 'contain'
    },
    Title: {
        fontFamily: 'Minecraft',
        fontSize: 20,
        marginTop: 100,
        color: '#ffff',
        backgroundColor: 'black',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 2,
        padding: 10,
        paddingTop: 20,
    },
    tomogochiImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 23,
    },
    backgroundImage: {
        width: '90%',
        height: '100%',
        marginTop: 70,
      },
    containerPrincipal: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        width: '100%',
        height: '90%',
    },

    ProximoPasso: {
        zIndex: 1,
        width: '80%',
        position: 'absolute',
        height: '8%',
        top: 550,
        backgroundColor: 'black',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 2,
    },
    ProximoPassoText: {
        color: 'white',
        fontFamily: 'Minecraft',
        fontSize: 32,
        textAlign: 'center',
        paddingTop: 12,
    },
    logo: {
        width: '100%',
        height: '25%',
        position: 'absolute',
        zIndex: 10,
        bottom: 559,
    },
    logoSelecao: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 10,
    },
    Selecionado: {
        position: 'absolute',
        zIndex: 15,
        width: '35%',
        height: '21%',
        backgroundColor: '#00ff6e',
        borderRadius: 5,
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
    EscolherCat: {
        marginRight: 160,
        marginBottom: 290,
        zIndex: 21,
        width: '34%',
        height: '20%',
        resizeMode: 'contain'
    },

    GochiCat: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 0.5,
    },
    EscolherDog: {
        zIndex: 21,
        bottom: 410,
        left: 220,
        width: '32%',
        position: 'absolute',
        height: '20%',
        resizeMode: 'contain'
    },
    GochiDog: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 0.5,

    },
    EscolherRato: {
        zIndex: 21,
        bottom: 250,
        left: 55,
        width: '32%',
        position: 'absolute',
        height: '20%',
        resizeMode: 'contain',
        backgroundColor: 'black',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 0.5,
    },
    GochiRato: {
        width: '100%',
        height: '100%',

    },
    EscolherPassaro: {
        zIndex: 21,
        bottom: 250,
        left: 220,
        width: '32%',
        position: 'absolute',
        height: '20%',
        resizeMode: 'contain'
    },
    GochiPassaro: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 0.5,

    },

});

