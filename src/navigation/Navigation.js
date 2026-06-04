import React, { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { usePermisos } from '../hooks/usePermisos';
import { useTema } from '../hooks/useTema';
import Icon from 'react-native-vector-icons/Ionicons';

import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

// Screens
import LoginScreen from '../screens/LoginScreen';
import InicioScreen from '../screens/InicioScreen';
import PagosScreen from '../screens/PagosScreen';
import GastosScreen from '../screens/GastosScreen';
import MensualidadesScreen from '../screens/MensualidadesScreen';
import CarteleraVirtualScreen from '../screens/CarteleraVirtualScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabBarIcon = React.memo(({ routeName, focused, color }) => {
  let iconName;

  switch (routeName) {
    case 'Inicio': iconName = focused ? 'home' : 'home-outline'; break;
    case 'Pagos': iconName = focused ? 'cash' : 'cash-outline'; break;
    case 'Cartelera': iconName = focused ? 'megaphone' : 'megaphone-outline'; break;
    case 'Gastos': iconName = focused ? 'cart' : 'cart-outline'; break;
    case 'Mensualidad': iconName = focused ? 'calendar' : 'calendar-outline'; break;
  }

  return <Icon name={iconName} size={26} color={color} />;
});

function LoggedInStack() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="MainTabs" component={MainTabs} />
      
      <AppStack.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ 
          presentation: 'modal', // Animación nativa de tarjeta/modal
          gestureEnabled: true,  // Permite swipe-to-dismiss nativo
        }}
      />
    </AppStack.Navigator>
  );
}

function MainTabs () {
  const { colores } = useTema();
  const insets = useSafeAreaInsets();
  
  const paddingAbajo = Math.max(insets.bottom, 10);
  const alturaBarra = 60 + paddingAbajo;

  const { 
    puedeVerGastos, 
    puedeVerMensualidad, 
    puedeVerCartelera 
  } = usePermisos();

  // Almacena la función de opciones en memoria y SOLO la recalcula si cambia el tema (colores) o la altura.
  const navigatorScreenOptions = useMemo(() => ({ route }) => ({
    headerShown: false, 
    safeAreaInsets: { bottom: 0 }, 
    tabBarStyle: {
      backgroundColor: colores.card, 
      borderTopWidth: 1,
      borderTopColor: colores.border, 
      height: alturaBarra, 
      paddingBottom: paddingAbajo, 
      paddingTop: 8,
      position: 'absolute', 
      left: 0, 
      right: 0, 
      bottom: 0,
      elevation: 5, 
    },
    tabBarLabelStyle: { fontSize: 11, fontWeight: 'bold' },
    tabBarActiveTintColor: colores.primario || '#3498db', 
    tabBarInactiveTintColor: colores.textPlaceholder || '#95a5a6', 
    tabBarIcon: ({ focused, color }) => (
      <TabBarIcon routeName={route.name} focused={focused} color={color} />
    ),
  }), [colores, alturaBarra]); // Dependencias estrictas

  return (
    <Tab.Navigator screenOptions={navigatorScreenOptions}>
      <Tab.Screen name='Inicio' component={InicioScreen} />
      <Tab.Screen name='Pagos' component={PagosScreen} />

      {puedeVerCartelera && (
        <Tab.Screen name='Cartelera' component={CarteleraVirtualScreen} options={{ tabBarLabel: 'Cartelera' }} />
      )}

      {puedeVerGastos && (
        <Tab.Screen name='Gastos' component={GastosScreen} />
      )}
      
      {puedeVerMensualidad && (
        <Tab.Screen name='Mensualidad' component={MensualidadesScreen} />
      )}
    </Tab.Navigator>
  );
}

function AuthStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function Navigation () {
  const { isLogueado } = usePermisos();

  return (
    <NavigationContainer>
      <StatusBar barStyle='light-content' backgroundColor='#000' />
      {isLogueado ? <LoggedInStack /> : <AuthStack />}
    </NavigationContainer>
  );
}