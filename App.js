import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { store } from './src/store/store';
import { injectStore } from './src/utils/clienteApi';
import Navigation from './src/navigation/Navigation';

// Inyectamos el store en el cliente HTTP ANTES de que se renderice cualquier pantalla
injectStore(store)

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}