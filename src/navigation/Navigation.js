import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTema } from '../hooks/useTema';

// <-- NUEVO 1: Importamos el hook para leer los márgenes del teléfono
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

// Screens
import LoginScreen from '../screens/LoginScreen';
import InicioScreen from '../screens/InicioScreen';
import PagosScreen from '../screens/PagosScreen';
import GastosScreen from '../screens/GastosScreen';
import MensualidadesScreen from '../screens/MensualidadesScreen';
import CarteleraVirtualScreen from '../screens/CarteleraVirtualScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs () {
  const modoOscuro = useSelector(state => state.tema.modoOscuro); 
  const { colores } = useTema();
  
  // <-- NUEVO 2: Obtenemos el margen inferior de forma estática
  const insets = useSafeAreaInsets();
  
  // <-- NUEVO 3: Calculamos la altura matemática exacta y la congelamos
  const paddingAbajo = Math.max(insets.bottom, 10);
  const alturaBarra = 60 + paddingAbajo;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        
        // <-- NUEVO 4: El "Candado". Le prohíbe a React Navigation achicar la barra
        safeAreaInsets: { bottom: 0 }, 
        
        tabBarStyle: {
          backgroundColor: colores.card, 
          borderTopWidth: 1,
          borderTopColor: colores.border, 
          
          // <-- NUEVO 5: Aplicamos las medidas congeladas
          height: alturaBarra, 
          paddingBottom: paddingAbajo, 
          paddingTop: 8,
          
          // <-- NUEVO 6: La volvemos una caja flotante absoluta para que el teclado/galería no la empujen
          position: 'absolute', 
          left: 0, 
          right: 0, 
          bottom: 0,
          elevation: 5, // Sombra para separarla visualmente
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: colores.primario || '#3498db', 
        tabBarInactiveTintColor: colores.textPlaceholder || '#95a5a6', 
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Mensualidad') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Pagos') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Gastos') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Cartelera') {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          }

          return <Icon name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name='Inicio' component={InicioScreen} />
      <Tab.Screen name='Mensualidad' component={MensualidadesScreen} />
      <Tab.Screen name='Pagos' component={PagosScreen} />
      <Tab.Screen name='Gastos' component={GastosScreen} />
      <Tab.Screen name='Cartelera' component={CarteleraVirtualScreen} options={{ tabBarLabel: 'Cartelera' }} />
    </Tab.Navigator>
  );
}

// Stack solo para pantallas de autenticación
function AuthStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function Navigation () {
  const isAuthenticated = useSelector(state => state.usuario.isAuthenticated);

  return (
    <NavigationContainer>
      <StatusBar barStyle='light-content' backgroundColor='#000' />
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}