import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { logout } from '../store/slices/usuarioSlice';
import { useTema } from '../hooks/useTema';

export default function MenuUsuario () {
  const { colores } = useTema();
  const { user } = useSelector(state => state.usuario);
  const dispatch = useDispatch();
  
  const insets = useSafeAreaInsets();

  // Función para cerrar sesión usando Redux
  const handleCerrarSesion = () => {
    dispatch(logout()); 
  };

  return (
    <View style={[
      styles.dropdownContainer, 
      { 
        backgroundColor: colores.card, 
        borderColor: colores.border,
        top: insets.top + 55
      }
    ]}>
      
      <View style={[styles.headerMenu, { borderBottomColor: colores.border }]}>
        <Text style={[styles.userName, { color: colores.textTitle }]} numberOfLines={1}>
          {user?.usuario || 'Usuario'}
        </Text>
        <Text style={[styles.userEmail, { color: colores.textPlaceholder }]} numberOfLines={1}>
          {user?.correo || 'correo@condominio.com'}
        </Text>
      </View>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Icon name="person-outline" size={20} color={colores.text} />
        <Text style={[styles.menuText, { color: colores.text }]}>Mi Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Icon name="settings-outline" size={20} color={colores.text} />
        <Text style={[styles.menuText, { color: colores.text }]}>Ajustes</Text>
      </TouchableOpacity>

      <View style={[styles.separador, { backgroundColor: colores.border }]} />

      <TouchableOpacity style={styles.menuItem} onPress={handleCerrarSesion} activeOpacity={0.7}>
        <Icon name="log-out-outline" size={20} color="#e74c3c" />
        <Text style={[styles.menuText, { color: '#e74c3c', fontWeight: 'bold' }]}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    right: 15,
    width: 220,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1000,
    overflow: 'hidden' 
  },
  headerMenu: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)' 
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2
  },
  userEmail: {
    fontSize: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 15,
    marginLeft: 14,
    fontWeight: '500'
  },
  separador: {
    height: 1,
    width: '100%',
    opacity: 0.5
  }
});
