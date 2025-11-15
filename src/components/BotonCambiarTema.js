import React from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';

import { cambiarTema } from '../store/slices/temaSlice';
import { useTema } from './../hooks/useTema';
import { useTemaAnimation } from '../hooks/useTemaAnimation';

export default function BotonCambiarTema() {
  const dispatch = useDispatch();
  const { modoOscuro } = useTema();
  
  const {
    mounted,
    rotate,
    scale,
    sunOpacity,
    moonOpacity,
    backgroundColor,
    sunScale,
    moonTranslateY,
    anunciarCambioTema,
    getAccessibilityLabel
  } = useTemaAnimation(modoOscuro);

  const handlePress = () => {
    dispatch(cambiarTema());
    anunciarCambioTema();
  };

  const accessibilityLabel = getAccessibilityLabel();

  // Evita parpadeos durante el montaje
  if (!mounted) {
    return (
      <TouchableOpacity 
        onPress={handlePress} 
        accessibilityRole="button" 
        accessibilityLabel={accessibilityLabel}
      >
        <View style={[styles.container, { width: 44, height: 44 }]} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: modoOscuro }}
    >
      <Animated.View 
        style={[
          styles.container, 
          { 
            transform: [{ rotate }, { scale }], 
            backgroundColor 
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.iconWrapper, 
            { 
              opacity: sunOpacity, 
              transform: [{ scale: sunScale }] 
            }
          ]}
        >
          <Icon 
            name="sunny" 
            size={22} 
            color={modoOscuro ? '#FFD54F' : '#FFA000'} 
          />
        </Animated.View>

        <Animated.View 
          style={[
            styles.iconWrapper, 
            styles.iconAbsolute, 
            { 
              opacity: moonOpacity, 
              transform: [{ translateY: moonTranslateY }] 
            }
          ]}
        >
          <Icon 
            name="moon" 
            size={20} 
            color={modoOscuro ? '#2C3E50' : '#FFF'} 
          />
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