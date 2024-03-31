import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, Text,TextInput, SafeAreaView, Pressable } from 'react-native';
import { auth } from '../../config/firebaseconfig';
import Spacing from '../../../constants/Spacing';
import FontSize from '../../../constants/FontSize';
import Colors from '../../../constants/Colors';
import Font from '../../../constants/Font';     
import Layout from '../../../constants/Layout';

const Register = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const [message, setMessage] = useState('');
    const handleLogin = () =>{
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setMessage('Faça login para acessar o aplicativo')
            console.log(user);
            console.log(message)
            setUser(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage)
            console.log(errorMessage)
        });
    }
    return (
        <SafeAreaView>
            <View style={{
                padding: Spacing * 2
            }}>
                <View style= {{
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: FontSize.xLarge,
                        color: Colors.primary,
                        fontFamily: Font["Poppins-Bold"],
                        marginVertical: Spacing * 3
                    }}>
                        Seja Bem-vindo!
                    </Text>
                </View>
                <View style ={{
                    marginVertical: Spacing * 3,

                }}>
                <TextInput
                        placeholder="Email"
                        placeholderTextColor={Colors.darkText}
                        value={email}
                        onChangeText={setEmail}
                        style={{
                            fontFamily: Font["poppins-regular"],
                            fontSize: FontSize.small,
                            padding: Spacing * 2,
                            backgroundColor: Colors.lightPrimary,
                            borderRadius: Spacing,
                            marginVertical: Spacing,
                        }}
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={{
                            fontFamily: Font["poppins-regular"],
                            fontSize: FontSize.small,
                            padding: Spacing * 2,
                            backgroundColor: Colors.lightPrimary,
                            borderRadius: Spacing,
                            marginVertical: Spacing,
                        }}
                    />
                </View>
                <Pressable 
                onPress={handleLogin}
                style={{
                    padding: Spacing * 2,
                    backgroundColor: Colors.primary,
                    marginVertical: Spacing * 3,
                    borderRadius: Spacing,
                    shadowColor: Colors.primary,
                    shadowOffset: {
                        width: 0,
                        height: Spacing,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: Spacing,
                }}>
                    <Text style={{
                        fontFamily: Font["poppins-bold"],
                        color: Colors.onPrimary,
                        textAlign: 'center',
                    }}>Registrar</Text>
                </Pressable>
            </View>
    </SafeAreaView>
    );
};

export default Register;

