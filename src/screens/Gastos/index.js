import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Button, Modal } from "react-native-web";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { auth } from "../../config/firebaseconfig";
import DropDownPicker from "react-native-dropdown-picker";

export function Gastos() {
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [list, setList] = useState([]);
  useEffect(() => {
    getGastos();
    handleGetCategorias();
    console.log("listaCategorias: ", listaCategorias);
  }, []);
  const getGastos = async () => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(
        child(dbRef, `users/${auth.currentUser.uid}/gastos/`)
      );
      if (snapshot.exists()) {
        setList(snapshot.val().list);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddGasto = (valor, categoria, descricao) => {
    if (!valor || !categoria || !descricao) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    const newGasto = {
      valor,
      categoria,
      descricao,
      createdAt: new Date().toLocaleTimeString(),
    };
    setErrorMessage(null);
    const newList = [...list, newGasto];
    writeUserData(newList);
  };

  function writeUserData(newList) {
    const db = getDatabase();
    set(ref(db, "users/" + auth.currentUser.uid + "/gastos/"), {
      list: newList,
    })
      .then(() => {
        console.log("cadastrou! ");
        console.log(listaCategorias);
        getGastos();
      })
      .catch((error) => {
        console.log("erro: ", error);
      });
  }
  const handleSetModalVisible = () => {
    if (visible) {
      setVisible(false);
      return;
    }
    setVisible(true);
  };

  const handleRemoveGasto = (index) => {
    const newList = list.filter((item, i) => i !== index);
    setList(newList);
  };

  const handleSetEditGastoVisible = (index) => {
    if (visibleEdit) {
      setVisibleEdit(false);
      return;
    }
    setVisibleEdit(true);
    updateFormValues(index);
  };

  const [valorEdit, setValorEdit] = useState("");
  const [categoriaEdit, setCategoriaEdit] = useState("");
  const [descricaoEdit, setDescricaoEdit] = useState("");
  const [indexToEdit, setIndexToEdit] = useState(null);
  const updateFormValues = (index) => {
    const item = list[index];
    setValorEdit(item.valor);
    setCategoriaEdit(item.categoria);
    setDescricaoEdit(item.descricao);
    setIndexToEdit(index);
  };
  const updateValuesDatabase = () => {
    const newList = [...list];
    newList[indexToEdit] = {
      valor: valorEdit,
      categoria: value,
      descricao: descricaoEdit,
      createdAt: new Date().toLocaleTimeString(),
    };
    writeUserData(newList);
  };

  const [listaCategorias, setListaCategorias] = useState([]);

  const handleGetCategorias = async () => {
    const db = ref(getDatabase());
    try {
      const snapshot = await get(
        child(db, `users/${auth.currentUser.uid}/categorias`)
      );
      if (snapshot.exists()) {
        const newList = snapshot.val().list.map((item) => ({
          label: item.nome,
          value: item.nome,
        }));
        console.table(newList)
        setListaCategorias(newList);
      } else {
        console.log("Tem nada");
      }
    } catch (error) {
      console.error("erro " + error);
    }
  };
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const handleOnClickDP = (value) => {
    setValue(value);
  };
  return (
    <View>
      <Modal visible={visible} animationType="slide">
        <Button
          title="Fechar"
          onPress={() => handleSetModalVisible()} 
          color="red"
        />
        <View style={styles.modal}>
          <Text style={{ fontWeight: "bold", fontSize: 32 }}>
            Adicione os valores do gasto
          </Text>
          <TextInput
            placeholder="Valor"
            style={styles.input}
            value={valor}
            onChangeText={(text) => {
              const numericValue = parseFloat(text);
              if (!isNaN(numericValue) || text === "") {
                setValor(text);
              }
            }}
            keyboardType="numeric"
          />
          {listaCategorias.length > 0 ? (
            <DropDownPicker
              open={open}
              value={value}
              items={listaCategorias}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setListaCategorias}
              onSelectItem={handleOnClickDP}
              placeholder="Selecione a categoria"
            />
          ) : (
            <></>
          )}
          <TextInput
            placeholder="Descrição"
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
          />
          <Button
            title="Adicionar Gasto"
            onPress={() => {
              handleSetModalVisible();
              handleAddGasto(valor, value, descricao);
            }}
          />
        </View>
      </Modal>

      <Button
        title="Adicionar Gasto"
        onPress={() => {
          handleSetModalVisible();
          handleGetCategorias();
        }}
      />
      <Text style={{ fontSize: 32, fontWeight: "bold", color: "red" }}>
        {errorMessage}
      </Text>
      {list.map((item, index) => (
        <View key={index} style={styles.gasto}>
          <Text>Valor: {item.valor}</Text>
          <Text>Categoria: {item.categoria}</Text>
          <Text>Descrição: {item.descricao}</Text>
          <Text>Criado às: {item.createdAt}</Text>
          <Button
            title="Editar Gasto"
            key={index}
            onPress={() => handleSetEditGastoVisible(index)}
          />
          <Button
            title="Remover Gasto"
            onPress={() => handleRemoveGasto(index)}
          />
        </View>
      ))}

      <Modal visible={visibleEdit} style={styles.modal}>
        <Button
          title="Fechar"
          onPress={() => handleSetEditGastoVisible()}
          color="red"
        />
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          Edite os valores do seu gasto
        </Text>
        <TextInput
          placeholder="Valor"
          style={styles.input}
          value={valorEdit}
          onChangeText={(text) => {
            const numericValue = parseFloat(text);
            if (!isNaN(numericValue) || text === "") {
              setValorEdit(text);
            }
          }}
          keyboardType="numeric"
        />
        {listaCategorias.length > 0 ? (
            <DropDownPicker
              open={open}
              value={value}
              items={listaCategorias}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setListaCategorias}
              onSelectItem={handleOnClickDP}
              placeholder="Selecione a categoria"
            />
          ) : (
            <></>
          )}
        <TextInput
          placeholder="Descrição"
          style={styles.input}
          value={descricaoEdit}
          onChangeText={(text) => {
            setDescricaoEdit(text);
          }}
        />
        <Button
          title="Editar Gasto"
          onPress={() => {
            updateValuesDatabase();
            handleSetEditGastoVisible();
          }}
        />
      </Modal>
      <Button
        color="red"
        title="Sair"
        onPress={() => {
          auth.signOut();
        }}
      />
    </View>
  );
}

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
    borderColor: "#f92e6a",
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
  },
  gasto: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#f92e6a",
    borderRadius: 32,
    gap: 4,
  },
});
