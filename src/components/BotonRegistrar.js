import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTema } from './../hooks/useTema';

export default function BotonRegistrar({puedeRegistrar, modalAbrir, icono = "add-outline"}) {
	const { colores } = useTema();
	const estilosBotonRegistrar = getEstilosGastos();

	return (
		<>
		{puedeRegistrar && (
	        <TouchableOpacity 
	          style={[estilosBotonRegistrar.fab, { backgroundColor: colores.backgroundBotones || '#007BFF' }]} 
	          onPress={modalAbrir}
	          activeOpacity={0.8}
	        >
	          <Icon name={icono} size={28} color="#fff" />
	        </TouchableOpacity>
	      )}
		</>
	)
}

const getEstilosGastos = () => StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
})