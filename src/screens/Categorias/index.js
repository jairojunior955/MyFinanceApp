import { getDatabase, ref, child, get, set } from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Modal, StyleSheet, View, TextInput, Text  } from "react-native";
import { auth } from "../../config/firebaseconfig";
import Font from "../../../constants/Font";

const Categorias = () => {
  const [nome, setNome] = useState("");
  const [visible, setVisible] = useState(false);
  const dbRef = ref(getDatabase());
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  useEffect(() => {
    renderCategories();
  }, []);
  const renderCategories = async () => {
    try {
      const snapshot = await get(
        child(dbRef, `users/${auth.currentUser.uid}/categorias`)
      );
      if (snapshot.exists()) {
        setList(snapshot.val().list);
      } else {
        const tempList = [
          { nome: "Alimentos", canChange: false },
          { nome: "Roupas", canChange: false },
          { nome: "Farmácia", canChange: false },
        ];
        writeCategory(tempList);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSetModalVisible = () => {
    if (visible) {
      setVisible(false);
      return;
    }
    setVisible(true);
  };
  const handleAddCategory = () => {
    if (!nome) {
      return;
    }
    const newCategory = {
      nome,
      canChange: true,
    };

    if (list.some((item) => item.nome === newCategory.nome)) {
      setMessage("Categoria já cadastrada!");
      return;
    }
    const newList = [...list, newCategory];
    writeCategory(newList);
  };
  function writeCategory(newList) {
    console.log(newList);
    const db = getDatabase();
    set(ref(db, "users/" + auth.currentUser.uid + "/categorias"), {
      list: newList,
    })
      .then(() => {
        renderCategories();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const handleRemoveCategory = (index) => {
    const newList = list.filter((item, i) => i !== index);
    console.log(newList);
    writeCategory(newList);
  };
  const [indexToEdit, setIndexToEdit] = useState(0);
  const handleEditCategory = () => {
    if (!nome) {
      return;
    }
    const newCategory = {
      nome,
      canChange: true,
    };
    const newList = list.map((item, i) => {
      if (i === indexToEdit) {
        return newCategory;
      }
      return item;
    });
    writeCategory(newList);
  };
  return (
    <>
      <Button
        title="Adicionar Categoria"
        onPress={() => handleSetModalVisible()}
      />
      <Text
        style={{ fontSize: 32, fontWeight: "bold", textAlign: "center" }}
      >
        {message}
      </Text>
      <Modal visible={visible} animationType="slide">
        <Button
          title="Fechar"
          onPress={() => handleSetModalVisible()}
        />
        <View style={styles.modal}>
          <Text style={{ fontWeight: "bold", fontSize: 32 }}>
            Crie uma nova categoria
          </Text>
          <TextInput
            placeholder="Nome da categoria"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
          <Button
            title="Adicionar Categoria"
            onPress={() => {
              handleAddCategory();
              handleSetModalVisible();
            }}
          />
        </View>
      </Modal>
      <Modal visible={editVisible} animationType="slide">
        <Button
          title="Fechar"
          onPress={() => setEditVisible(false)}
        />
        <View style={styles.modal}>
          <Text style={{ fontWeight: "bold", fontSize: 32 }}>
            Edite a categoria
          </Text>
          <TextInput
            placeholder="Nome da categoria"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
          <Button
            title="Editar Categoria"
            onPress={() => {
              handleEditCategory();
              setEditVisible(false);
            }}
          />
        </View>
      </Modal>
      <View>
        {list.map((item, index) => (
          <View key={index} style={styles.categoria}>
            <Text style={{fontFamily: Font['poppins-regular']}}>{item.nome}</Text>
            {item.canChange ? (
              <View style={{gap:8}}>
                <Button
                  title="Editar Categoria"
                  key={index}
                  onPress={() => {
                    setEditVisible(true);
                    setIndexToEdit(index);
                  }}
                />
                <Button
                  title="Remover Categoria"
                  onPress={() => {
                    handleRemoveCategory(index);
                  }}
                />
              </View>
            ) : (
              <></>
            )}
          </View>
        ))}
      </View>
    </>
  );
};
export default Categorias;
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    width: "100%",
    marginBottom: 8,
    borderWidth: 1,
    padding: 8,
  },
  categoria: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: "space-between",
    gap: 8,
  },
});
