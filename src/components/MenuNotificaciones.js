import {
  View, Text, TouchableOpacity, StyleSheet, FlatList
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { NOTIF_DATA } from '../utils/constants'

export default function MenuNotificaciones () {
  const renderItem = ({ item }) => (
    <View style={estilosNotificaciones.notificationItem}>
      <Icon name='information-circle' size={24} color='#007BFF' style={estilosNotificaciones.notificationIcon} />
      <View style={estilosNotificaciones.notificationTextContainer}>
        <Text style={estilosNotificaciones.notificationItemTitle}>{item.title}</Text>
        <Text style={estilosNotificaciones.notificationItemSubtitle}>{item.text}</Text>
      </View>
    </View>
  )

  return (
    <View style={[estilosNotificaciones.dropdownContainer, estilosNotificaciones.notificationContainer]}>
      <View style={estilosNotificaciones.notificationHeader}>
        <Text style={estilosNotificaciones.notificationTitle}>Notificaciones</Text>
        <TouchableOpacity>
          <Text style={estilosNotificaciones.notificationLink}>Marcar todas como leídas</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={NOTIF_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {!NOTIF_DATA && <Text>Sin notificaciones</Text>}
    </View>
  )
}

const estilosNotificaciones = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    top: 85,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 1000
  },

  notificationContainer: {
    right: 15,
    width: 320,
    maxHeight: 400
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F3F5'
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  notificationLink: {
    fontSize: 12,
    color: '#007BFF',
    fontWeight: '500'
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F3F5'
  },
  notificationIcon: {
    marginRight: 10
  },
  notificationTextContainer: {
    flex: 1
  },
  notificationItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529'
  },
  notificationItemSubtitle: {
    fontSize: 13,
    color: '#6C757D'
  }
})
