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

                    source={require('../assets/images/TitleCadastro.png')}
                    style={styles.logo}
                />
                <View style={styles.containerPrincipal}>

                    <Image
                        source={require('../assets/images/BackSelecao.png')}
                        style={styles.logoSelecao}
                    />
                    <TouchableOpacity style={styles.EscolherCat} >
                        <Image
                            source={require('../assets/images/TomogochiCat.png')}
                            style={styles.GochiCat}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.EscolherDog} >
                        <Image
                            source={require('../assets/images/TomogochiDog.png')}
                            style={styles.GochiDog}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.EscolherRato} >
                        <Image
                            source={require('../assets/images/TomogochiRato.png')}
                            style={styles.GochiRato}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.EscolherPassaro} >
                        <Image
                            source={require('../assets/images/TomogochiPassaro.png')}
                            style={styles.GochiPassaro}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.ProximoPasso} >
                        <Image
                            source={require('../assets/images/ProximoPassoBtt.png')}
                            style={styles.versao}
                        />
                    </TouchableOpacity>


                </View>

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

    ProximoPasso: {
        zIndex: 12,
        width: '100%',
        position: 'absolute',
        height: '100%',
    },
    logo: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 10,
    },
    logoSelecao: {
        width: '100%',
        height: '100%',
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
    EscolherCat: {
        marginRight: 160,
        marginBottom: 200,
        zIndex: 21,
        width: '34%',
        height: '20%',
        resizeMode: 'contain'
    },

    GochiCat: {
        width: '100%',
        height: '100%',
    },
    EscolherDog: {
        zIndex: 21,
        bottom:365,
        left:220,
        width: '32%',
        position: 'absolute',
        height: '20%',
        resizeMode: 'contain'
    },
    GochiDog: {
        width: '100%',
        height: '100%',
      
    },
    EscolherRato: {
        zIndex: 21,
        bottom:200,
        left:45,
        width: '32%',
        position: 'absolute',
        height: '20%',
        resizeMode: 'contain'
    },
    GochiRato: {
        width: '100%',
        height: '100%',
      
    },
    EscolherPassaro: {
        zIndex: 21,
        bottom:200,
        left:220,
        width: '32%',
        position: 'absolute',
        height: '20%',
        resizeMode: 'contain'
    },
    GochiPassaro: {
        width: '100%',
        height: '100%',
      
    },
});

