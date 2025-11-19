import { StyleSheet } from 'react-native'

export const getEstilosPublicacion = (colores) => StyleSheet.create({
  cardContainer: {
    backgroundColor: colores.card,
    borderRadius: 12,
    borderWidth: 0.1,
    marginBottom: 16,
    shadowColor: colores.text,
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    minHeight: 100 // Altura mínima para que sea visible
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  placeholderImage: {
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContent: {
    padding: 14
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colores.text,
    marginBottom: 4
  },
  cardDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8
  },
  cardDescription: {
    fontSize: 14,
    color: colores.text,
    lineHeight: 20
  }
})
