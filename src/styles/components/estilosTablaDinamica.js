import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const getEstilosTablaDinamica = (colores) => StyleSheet.create({
  scrollVertical: {
    flex: 1,
    maxHeight: 400,
  },
  contenedor: {
    flex: 1,
    padding: 6,
    marginBottom:10
  },
  busqueda: {
    marginBottom: 8,
    backgroundColor: colores.inputBackground,
  },
  infoContainer: {
    padding: 8,
    backgroundColor: colores.inputBackground,
    borderRadius: 4,
    marginBottom: 8
  },
  infoText: {
    fontSize: 12,
    color: colores.text,
    textAlign: 'center'
  },
  tabla: {
    maxWidth: width - 16,
    backgroundColor: colores.backgroundTabla,
    flex: 1
  },
  row: {
    borderBottomWidth: 1,
    borderColor: colores.border,
    minHeight: 44,
    paddingVertical: 2,
  },
  cell: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  cellRight: {
    justifyContent: 'flex-end'
  },
  cellCenter: {
    justifyContent: 'center'
  },
  cellText: {
    fontSize: 12, 
    color: colores.text,
  },
  textRight: {
    textAlign: 'right'
  },
  textCenter: {
    textAlign: 'center'
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.text
  },
  // Estilos para "Ver más"
  verMasHeader: {
    flex: 0.8,
    justifyContent: 'center',
    minWidth: 80,
  },
  verMasCell: {
    flex: 0.8,
    justifyContent: 'center',
    minWidth: 80,
  },
  verMasBtn: {
    backgroundColor: colores.backgroundBotones,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  verMasText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colores.border,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  modalValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  cerrarBtn: {
    marginTop: 16,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  cerrarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noResults: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    padding: 20
  },
  // Estilos para las acciones
  contenedorAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  botonAccion: {
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonVerMas: {
    backgroundColor: '#2196F3',
  },
  accionesCell: {
    flex: 1,
    justifyContent: 'center',
  },
  accionesHeader: {
    flex: 1,
    justifyContent: 'center',
  }
})