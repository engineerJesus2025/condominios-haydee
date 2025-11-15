import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View, AccessibilityInfo } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';

import { cambiarTema } from '../store/slices/temaSlice';
import { useTema } from './../hooks/useTema';

export default function BotonCambiarTema() {
  const dispatch = useDispatch();
  const { modoOscuro } = useTema();
  const [mounted, setMounted] = useState(true);

  // 0 = claro, 1 = oscuro
  const anim = useRef(new Animated.Value(modoOscuro ? 0 : 1)).current;

  useEffect(() => {
    // por si el store ya tiene tema
    anim.setValue(modoOscuro ? 0 : 1);
    setMounted(true);
  }, []);

  useEffect(() => {
    // anima cuando cambia el modo desde fuera
    Animated.timing(anim, {
      toValue: modoOscuro ? 0 : 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [modoOscuro]);

  // transformaciones
  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '40deg'],
  });
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.86],
  });
  const sunOpacity = anim.interpolate({ inputRange: [0, 0.5], outputRange: [1, 0], extrapolate: 'clamp' });
  const moonOpacity = anim.interpolate({ inputRange: [0.5, 1], outputRange: [0, 1], extrapolate: 'clamp' });

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.12)'],
  });

  function onPress() {

    dispatch(cambiarTema());
    // Para accesibilidad: anunciar el nuevo estado
    const label = modoOscuro ? 'Modo claro activado' : 'Modo oscuro activado';
    AccessibilityInfo.announceForAccessibility(label);
  }

  // evita renderizar animaciones antes de montar (evita parpadeos)
  if (!mounted) {
    return (
      <TouchableOpacity onPress={onPress} accessibilityRole="button" accessibilityLabel={modoOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}>
        <View style={[styles.container, { width: 44, height: 44 }]} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={modoOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
      accessibilityState={{ selected: modoOscuro }}
    >
      <Animated.View style={[styles.container, { transform: [{ rotate }, { scale }], backgroundColor }]}>
        <Animated.View style={[styles.iconWrapper, { opacity: sunOpacity, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] }) }] }]}>
          <Icon name="sunny" size={22} color={modoOscuro ? '#FFD54F' : '#FFA000'} />
        </Animated.View>

        <Animated.View style={[styles.iconWrapper, styles.iconAbsolute, { opacity: moonOpacity, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }] }]}>
          <Icon name="moon" size={20} color={modoOscuro ? '#2C3E50' : '#FFF'} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAbsolute: {
    position: 'absolute',
  },
});
