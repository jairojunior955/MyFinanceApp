import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { auth } from '../../config/firebaseconfig';

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
        <View style={styles.container}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Sign Up" onPress={handleLogin} />        
            <Text>{error}</Text>
            <Text>{message}</Text>
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16
    },
    input: {
        height: 40,
        width: "100%",
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 8,
        padding: 8,
    },
})                      