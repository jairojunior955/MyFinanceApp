import { Button, Pressable, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { useEffect, useState } from "react";
import { auth } from "../../config/firebaseconfig";
import Font from "../../../constants/Font";

export const Graficos = () => {
  const [list, setList] = useState([]);
  const [rawData, setRawData] = useState([]); // Adicionado
  const screenWidth = Dimensions.get("window").width;
  useEffect(() => {
    getGastos();
  }, []);

  const getGastos = async () => {
    const dbRef = ref(getDatabase());
    try {
      const snapshotGasto = await get(
        child(dbRef, `users/${auth.currentUser.uid}/gastos/`)
      );
      if (snapshotGasto.exists()) {
        const rawData = snapshotGasto.val().list;
        setRawData(rawData);
        console.log(rawData);
        const processedData = processGastos(rawData);
        setList(processedData);
        console.log(processedData);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const processGastos = (gastos) => {
    const gastosAgrupados = gastos.reduce((acc, item) => {
      const { createdAt, valor } = item;
      if (acc[createdAt]) {
        acc[createdAt] += Number(valor);
      } else {
        acc[createdAt] = Number(valor);
      }
      return acc;
    }, {});

    // Transforma o objeto em uma lista de objetos para compatibilidade com o gráfico
    const processedList = Object.keys(gastosAgrupados).map((date) => ({
      createdAt: date,
      valor: gastosAgrupados[date],
    }));

    return processedList;
  };
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `#f92e6a`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const data = {
    labels: list.map((item) => item.createdAt),
    datasets: [
      {
        data: list.map((item) => item.valor),
        color: (opacity = 1) => `#f92e6a`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Gastos por dia"], // optional
  };

  const gerarCorAleatoria = () => {
    const r = Math.floor(Math.random() * 256); // Valor de 0 a 255 para vermelho
    const g = Math.floor(Math.random() * 256); // Valor de 0 a 255 para verde
    const b = Math.floor(Math.random() * 256); // Valor de 0 a 255 para azul
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  const [averageByCategory, setAverageByCategory] = useState([]);

  useEffect(() => {
    groupByCategory();
    calculateAverageByCategory();
  }, [rawData]);

  const calculateAverageByCategory = () => {
    const categories = {};
    rawData.forEach((item) => {
      const { categoria, valor } = item;
      if (categories[categoria]) {
        categories[categoria].total += Number(valor);
        categories[categoria].count += 1;
      } else {
        categories[categoria] = {
          total: Number(valor),
          count: 1,
        };
      }
    });
    
    const averageList = Object.keys(categories).map((category) => ({
      category,
      average: categories[category].total / categories[category].count,
    }));

    setAverageByCategory(averageList);
  };
  
  console.log("data raw", rawData)

const groupByCategory = () => {
    const contagem = {};
    rawData.forEach((item) => {
        const { categoria } = item;
        if (contagem[categoria]) {
            contagem[categoria] += 1;
        } else {
            contagem[categoria] = 1;
        }
    });

    const pieData = Object.keys(contagem).map((category) => ({
        name: category,
        population: contagem[category],
        color: gerarCorAleatoria(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
    }));

    return pieData;
};
const pieData = groupByCategory();
  return (
    <>
      {list.length > 0 ? (
        <View>
          <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            fromZero={true}
          />
        </View>
      ) : (
        <Text>Nada aqui</Text>
      )}
      

      <View>
        <PieChart
          data={pieData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: "#1cc910",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
        />
      </View>
      <View style={{ marginVertical: 10, padding:8}}>
        <Text
          style={{ fontSize: 24, fontWeight: "bold", alignItems: "center", fontFamily: Font["poppins-bold"]}}
        >
          Média de gastos
        </Text>
        {averageByCategory.map((item, index) => (
          <View key={index}>
            <Text style={{fontFamily: Font["poppins-regular"]}}>
              {item.category}: {item.average.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
};
