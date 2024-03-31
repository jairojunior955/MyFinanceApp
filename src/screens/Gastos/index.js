import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  TextInput,
  SafeAreaView,
  Pressable,
} from "react-native";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { auth } from "../../config/firebaseconfig";
import DropDownPicker from "react-native-dropdown-picker";
import { formatarData } from "../../utils/Date";
import { Slider } from "@miblanchard/react-native-slider";
import MaskInput, { Masks } from "react-native-mask-input";
import Font from "../../../constants/Font";

export function Gastos() {
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [list, setList] = useState([]);
  const [completeList, setCompleteList] = useState([]);

  useEffect(() => {
    getGastos();
    handleGetCategorias();
  }, []);
  const getGastos = async () => {
    const dbRef = ref(getDatabase());
    try {
      const snapshot = await get(
        child(dbRef, `users/${auth.currentUser.uid}/gastos/`)
      );
      if (snapshot.exists()) {
        setList(snapshot.val().list);
        setCompleteList(snapshot.val().list);
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

    dataAtual = formatarData(new Date());
    const newGasto = {
      valor,
      categoria,
      descricao,
      createdAt: dataAtual,
    };
    setErrorMessage(null);
    const newList = [...list, newGasto];
    writeUserData(newList);
  };
  const maiorValor = () => {
    let biggestValor = 0;
    list.forEach((item) => {
      if (item.valor > biggestValor) {
        biggestValor = item.valor;
      }
    });
    return biggestValor;
  };
  function writeUserData(newList) {
    const db = getDatabase();
    set(ref(db, "users/" + auth.currentUser.uid + "/gastos/"), {
      list: newList,
    })
      .then(() => {
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
    writeUserData(newList);
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
    setValue(item.categoria);
    setCategoriaEdit(item.categoria);
    setDescricaoEdit(item.descricao);
    setIndexToEdit(index);
  };
  const updateValuesDatabase = () => {
    const newList = [...list];
    dataAtual = formatarData(new Date());
    newList[indexToEdit] = {
      valor: valorEdit,
      categoria: value,
      descricao: descricaoEdit,
      createdAt: dataAtual,
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
        setListaCategorias(newList);
      } else {
        console.log("No data");
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

  const [searchText, setSearchText] = useState("");
  const filterList = (searchText, low, high, startDate, endDate) => {
    // Convertendo low e high para números, tratando strings vazias como limites não definidos.
    const lowNumber = low === "" ? Number.MIN_SAFE_INTEGER : Number(low);
    const highNumber = high === "" ? Number.MAX_SAFE_INTEGER : Number(high);
    console.log(lowNumber, highNumber, searchText);
    // Verifica se low e high são números válidos, caso contrário, define-os para limites máximos/minimos.
    const isLowValid = !isNaN(lowNumber);
    const isHighValid = !isNaN(highNumber);

    const filteredList = completeList.filter((item) => {
      const descricaoMatch = item.descricao
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const categoriaMatch = item.categoria
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const valueMatch =
        (isLowValid ? Number(item.valor) >= lowNumber : true) &&
        (isHighValid ? Number(item.valor) <= highNumber : true);
      const dateMatch = isDateInRange(item.createdAt, startDate, endDate);
      return (descricaoMatch || categoriaMatch) && (valueMatch || dateMatch);
    });
    setList(filteredList);
  };

  const isDateInRange = (date, startDate, endDate) => {
    date = new Date(date);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    return date >= formattedStartDate && date <= formattedEndDate;
  };

  const formatDate = (date) => {
    const [day, month, year] = date.split("/");
    return new Date(`${day}-${month}-${year}`);
  };
  const [high, setHigh] = useState(null);
  const [low, setLow] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <SafeAreaView>
      <View contentContainerStyle={{ flexGrow: 1 }}>
        <Modal visible={visible} animationType="slide">
          <Button
            fontFamily={Font["poppins-bold"]}
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
              style={styles.button}
              title="Adicionar Gasto"
              onPress={() => {
                handleSetModalVisible();
                handleAddGasto(valor, value, descricao);
              }}
            />
          </View>
        </Modal>

        <Button
          style={styles.button}
          title="Adicionar Gasto"
          onPress={() => {
            handleSetModalVisible();
            handleGetCategorias();
          }}
        />

        <TextInput
          placeholder="Filtrar por categoria ou por descrição"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
          }}
          style={styles.input}
        />
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <TextInput
              placeholder="Valor inicial"
              keyboardType="numeric"
              value={low}
              onChangeText={(value) => {
                if (!isNaN(value)) setLow(value);
              }}
              style={{
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 8,
                gap: 8,
                padding: 8,
              }}
            ></TextInput>
            <TextInput
              placeholder="Valor final"
              keyboardType="numeric"
              value={high}
              onChangeText={(value) => {
                if (!isNaN(value)) setHigh(value);
              }}
              style={{
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 8,
                gap: 8,
                padding: 8,
              }}
            ></TextInput>
          </View>
        </View>
        <MaskInput
          value={startDate}
          onChangeText={(masked) => {
            setStartDate(masked);
          }}
          placeholder="Data Inicial dd/mm/aaaa)"
          mask={Masks.DATE_DDMMYYYY}
        />

        <MaskInput
          value={endDate}
          onChangeText={(masked) => {
            setEndDate(masked);
          }}
          placeholder="Data Final (dd/mm/aaaa)"
          mask={Masks.DATE_DDMMYYYY}
        />

        <Text style={{ fontFamily: Font["poppins-bold"] }}>
          Filtre por preço R${low} - R${high}
        </Text>

        <Button
          style={styles.button}
          title="Filtrar"
          onPress={() => {
            filterList(searchText, low, high, startDate, endDate);
          }}
        />    

        <Text style={{ fontSize: 16, fontWeight: "bold", color: "red" }}>
          {errorMessage}
        </Text>
        <FlatList
          data={list}
          scrollEnabled={true}
          ListFooterComponent={<View style={{ height: 560 }} />}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.gasto}>
              <Text style={{fontFamily: Font['poppins-regular']}}>Valor: {item.valor}</Text>
              <Text style={{fontFamily: Font['poppins-regular']}}>Categoria: {item.categoria}</Text>
              <Text style={{fontFamily: Font['poppins-regular']}}>Descrição: {item.descricao}</Text>
              <Text style={{fontFamily: Font['poppins-regular']}}>Criado às: {item.createdAt}</Text>
              <Button
                style={styles.button}
                title="Editar Gasto"
                onPress={() => handleSetEditGastoVisible(index)}
              />
              <Button
                style={styles.button}
                title="Remover Gasto"
                onPress={() => handleRemoveGasto(index)}
              />
            </View>
          )}
        />
        {list == 0 ? (
          <Text
            style={{
              fontSize: 20,
              alignContent: "center",
              flexDirection: "row",
            }}
          >
            Nenhuma correspondência encontrada, limpe os filtros
          </Text>
        ) : (
          <></>
        )}

        <Modal visible={visibleEdit} style={styles.modal}>
          <Button
            style={styles.button}
            title="Fechar"
            onPress={() => handleSetEditGastoVisible()}
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
              placeholder={categoriaEdit}
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
            fontFamily={Font["poppins-bold"]}
            title="Editar Gasto"
            onPress={() => {
              updateValuesDatabase();
              handleSetEditGastoVisible();
            }}
          />
        </Modal>
      </View>
    </SafeAreaView>
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
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    fontFamily: Font["poppins-regular"],
  },
  gasto: {
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#66645e",
    borderRadius: 32,
    gap: 4,
    fontFamily: Font["poppins-bold"],
  },
  button: {
    fontFamily: Font["poppins-bold"],
  },
});
