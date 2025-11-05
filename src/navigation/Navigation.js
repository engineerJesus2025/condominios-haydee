import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

// Screens
import MensualidadesScreen from '../screens/MensualidadesScreen'
import LoginScreen from '../screens/LoginScreen'

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
        name='Mensualidad'
        component={MensualidadesScreen}
      />
    </Drawer.Navigator>
  )
}

// Stack Navigator
function MyStack () {
  return (
    <Stack.Navigator initialRouteName='Login'>
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
      <MyStack />
    </NavigationContainer>
  )
}
