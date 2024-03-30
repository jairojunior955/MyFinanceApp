import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./src/screens/Home/index";
import Login from "./src/screens/Login/index";
import Register from "./src/screens/Register/index";
import { Gastos } from "./src/screens/Gastos";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/config/firebaseconfig";
import Categorias from "./src/screens/Categorias";

const Drawer = createDrawerNavigator();
const Finance = createDrawerNavigator();

function FinanceDrawer() {
  return (
    <Finance.Navigator>
      <Finance.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTintColor: "#f92e6a" }}
      />
      <Finance.Screen name="Gastos" component={Gastos} />
      <Finance.Screen name="Categorias" component={Categorias} />
    </Finance.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("user" + user);
      setUser(user);
    });
  }, []);
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        {user ? (
          <Drawer.Screen
            name="Finance"
            component={FinanceDrawer}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Drawer.Screen name="Register" component={Register} />
            <Drawer.Screen name="Login" component={Login} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
