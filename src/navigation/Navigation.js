import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
// Screens
import LoginScreen from '../screens/LoginScreen'
import InicioScreen from '../screens/InicioScreen'
import PagosScreen from '../screens/PagosScreen'
import GastosScreen from '../screens/GastosScreen'
import MensualidadesScreen from '../screens/MensualidadesScreen'
import CarteleraVirtualScreen from '../screens/CarteleraVirtualScreen'

import MenuLateral from '../components/MenuLateral'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

function MyDrawer () {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <MenuLateral {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280
        },
        drawerType: 'front'
      }}
    >
      

      <Drawer.Screen
        name='Inicio'
        component={InicioScreen}
      />
      <Drawer.Screen
        name='Mensualidad'
        component={MensualidadesScreen}
      />
      <Drawer.Screen
        name='Pagos'
        component={PagosScreen}
      />

      <Drawer.Screen
        name='Gastos'
        component={GastosScreen}
      />
      <Drawer.Screen
        name='CarteleraVirtual'
        component={CarteleraVirtualScreen}
      />
    </Drawer.Navigator>
  )
}

// Stack Navigator
function MyStack () {
  return (
    <Stack.Navigator initialRouteName='MainApp'>
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{ title: 'Login', headerShown: false }}
      />
      <Stack.Screen
        name='MainApp'
        component={MyDrawer}
        options={{ title: 'App Principal', headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default function Navigation () {
  return (
    <NavigationContainer>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000"
      />
      <MyStack />
    </NavigationContainer>
  )
}
