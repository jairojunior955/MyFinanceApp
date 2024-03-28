import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
    return (
        <View style = {styles.container}>
            <Text style = {styles.text}>Home Screen</Text>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16
    },
});