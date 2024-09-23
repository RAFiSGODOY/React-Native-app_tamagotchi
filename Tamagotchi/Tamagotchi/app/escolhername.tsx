import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, TextInput, Text, Alert, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useProductDatabase } from '../app/database/Service';
type NavigationProps = NavigationProp<any>;
type RouteParams = {
    tomogochi: string;
};
export default function Escolhername() {
    const navigation = useNavigation<NavigationProps>();
    const [selectedTomogochi, setSelectedTomogochi] = useState<string | null>(null);
    const rotation = useRef(new Animated.Value(0)).current;
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const { tomogochi } = route.params;
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [tipo, setTipo] = useState<string>('');
    const [hunger, setHunger] = useState<number>(100);
    const [coin, setCoin] = useState<number>(10);
    const [sleep, setSleep] = useState<number>(100);
    const [fun, setFun] = useState<number>(100);
    const [status, setStatus] = useState<number>(300);
    const scrollX = useRef(new Animated.Value(0)).current;
    const animation = useRef<Animated.CompositeAnimation | null>(null);
    const [selectedTomogochiImage, setSelectedTomogochiImage] = useState<any>(null);
    const [selectedTomogochiImage2, setSelectedTomogochiImage2] = useState<any>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const productDatabase = useProductDatabase();
    const [textoModal, setTextoModal] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const close = () => {
        setModalVisible(false)
    }
    async function create() {
        try {
            const response = await productDatabase.createTodo({
                tipo,
                coin,
                name,
                hunger,
                sleep,
                fun,
                status,
                image:selectedTomogochiImage2
            })
            console.log(response)
            IniciarTemporario();
        } catch (error) {
            console.log('erroaqui')
            console.log(error);
            
        }

    };

    const IniciarTemporario = () => {
        navigation.navigate('index');
    }

    const handleConfirmName = () => {
        if (!name) {
            setModalVisible(true)
            setTextoModal("Please choose a name for your tamagotchi")
            return;
        }
        create();

    };

    useEffect(() => {
        let image;
        setSelectedTomogochi(tomogochi)
        setTipo(tomogochi)
        switch (tomogochi) {
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
        setSelectedTomogochiImage2(tomogochi);
        setSelectedTomogochiImage(image);
    }, [tomogochi]);
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
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
            <Text style={styles.Title}>Choose the name of your tamagotchi</Text>
            <View style={styles.containerPrincipal}>

                <View style={styles.containerPrincipal}>
                    {selectedTomogochiImage && (
                        <Image
                            source={selectedTomogochiImage}
                            style={styles.tomogochiImage}
                        />
                    )}
                    <TextInput
                        style={styles.textInput}
                        placeholder="Choose your name"
                        placeholderTextColor="#FFFF"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <TouchableOpacity style={styles.ProximoPasso} onPress={handleConfirmName} >
                    <Text style={styles.Title3} >REGISTER</Text>
                </TouchableOpacity>
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

        </KeyboardAvoidingView>

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
        marginTop: 20,
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
    Title3: {
        fontFamily: 'Minecraft',
        fontSize: 32,
        textAlign: 'center',
        color: '#ffff',
        backgroundColor: 'black',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 2,
        width: '80%',
        paddingTop: 10,
    },
    Title: {
        fontFamily: 'Minecraft',
        fontSize: 40,
        marginTop: 80,
        color: '#ffff',
        backgroundColor: 'black',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 2,
        padding: 12,
        textAlign: 'center',
        width: '90%',
        left: 20,
    },
    textInput: {
        width: '90%',
        height: '8%',
        position: 'absolute',
        zIndex: 10,
        fontSize:30,
        backgroundColor: 'black',
        color: 'white',
        left: 20,
        fontFamily: 'Minecraft',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 2,
        textAlign: 'center',
        top: '70%',
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
    containerPrincipal: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        width: '100%',
        height: '90%',
        position: 'absolute',
    },

    ProximoPasso: {
        zIndex: 12,
        width: '100%',
        height: '20%',
        top: 400,
        alignItems:'center',
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
        top: 40,
    },
    versao: {
        width: '100%',
        height: '95%',
        position: 'absolute',
        zIndex: 10,
    },
    tomogochiImage: {
        marginRight: 0,
        marginBottom: 50,
        zIndex: 21,
        width: '54%',
        height: '30%',
        resizeMode: 'contain',
        position: 'absolute',
    },

});

