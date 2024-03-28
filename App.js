import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'; 
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/screens/Home/Index';
import Login from './src/screens/Login';

const Drawer = createDrawerNavigator()
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name='Home' component={HomeScreen} options={ {headerTintColor:'#f92e6a'}}/>
        <Drawer.Screen name='Login' component={Login}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

