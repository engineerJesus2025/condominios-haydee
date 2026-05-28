import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AppStack = createStackNavigator();

function LoggedInStack() {
  return (
    <AppStack.Navigator
      screenOptions={{ 
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      {/* Las pestañas principales */}
      <AppStack.Screen name="MainTabs" component={MainTabs} />
      
      {/* La pantalla de perfil fuera del Tab para que cubra toda la pantalla */}
      <AppStack.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ 
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
          // Permite cerrar la pantalla deslizando hacia abajo (swipe-to-dismiss)
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </AppStack.Navigator>
  );
}

function MainTabs () {
  const modoOscuro = useSelector(state => state.tema.modoOscuro); 
  const { colores } = useTema();
  const insets = useSafeAreaInsets();
  
  const paddingAbajo = Math.max(insets.bottom, 10);
  const alturaBarra = 60 + paddingAbajo;

  const { 
    puedeVerGastos, 
    puedeVerMensualidad, 
    puedeVerCartelera 
  } = usePermisos();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case 'Inicio': iconName = focused ? 'home' : 'home-outline'; break;
            case 'Pagos': iconName = focused ? 'cash' : 'cash-outline'; break;
            case 'Cartelera': iconName = focused ? 'megaphone' : 'megaphone-outline'; break;
            case 'Gastos': iconName = focused ? 'cart' : 'cart-outline'; break;
            case 'Mensualidad': iconName = focused ? 'calendar' : 'calendar-outline'; break;
          }

          return <Icon name={iconName} size={26} color={color} />;
        },
      })}
    >
      {/* Inicio: Siempre visible */}
      <Tab.Screen name='Inicio' component={InicioScreen} />
      
      {/* Pagos: Accesible para todos, el backend ya filtra si ve todo o solo lo suyo */}
      <Tab.Screen name='Pagos' component={PagosScreen} />

      {/* Cartelera: Visible si tiene el permiso */}
      {puedeVerCartelera && (
        <Tab.Screen name='Cartelera' component={CarteleraVirtualScreen} options={{ tabBarLabel: 'Cartelera' }} />
      )}

      {/* Módulos netamente administrativos */}
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