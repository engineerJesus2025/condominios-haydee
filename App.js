import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'
import { store } from './src/store/store'
import Navigation from './src/navigation/Navigation'

export default function App () {
  return (
  	<SafeAreaProvider>
	    <Provider store={store}>
	      <Navigation />
	    </Provider>
    </SafeAreaProvider>
  )
}
