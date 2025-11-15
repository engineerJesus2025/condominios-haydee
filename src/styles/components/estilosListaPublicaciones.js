import { StyleSheet } from 'react-native'

export const getEstilosListaPublicaciones = (colores) => StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colores.textTitle,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    minHeight: 100, // Altura mínima para que sea visible
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
});