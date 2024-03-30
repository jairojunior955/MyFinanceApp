import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { auth } from "../../config/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";

const HomeScreen = () => {
  const [date, setDate] = useState(new Date())
  const handleAddExpense = () => {
    console.log("Adicionar Gasto");
  };
  const handleOpenExpenses = () => {
    console.log("Ver Gasto");
  }
  const [username, setUsername] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("user" + user.email);
      setUsername(user.email);
    });
  }, []);
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text}>Seja Bem vindo! {username}</Text>
        <Text style={styles.text}>My Finance App </Text>
      </View>
      <View style={styles.options}>
        <Button title="Adicionar Gasto" onPress={handleAddExpense} />
        <Button title="Ver Gasto" onPress={handleOpenExpenses}/>
      </View>
      <Button
        color="red"
        title="Sair"
        onPress={() => {
          auth.signOut();
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});
