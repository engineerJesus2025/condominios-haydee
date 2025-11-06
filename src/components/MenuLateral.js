import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

import { LISTA_MENU } from '../utils/constants'

const MenuLateral = (props) => {
  const [expandedItems, setExpandedItems] = useState({})

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }

  const MenuItem = ({ item, level = 0, isChild = false }) => {
    const isActive = props.state.routes[props.state.index].name === item.screen
    const isExpanded = expandedItems[item.name]

    if (!item.permission) return null

    return (
      <View>
        <TouchableOpacity
          style={[
            estilosMenuLateral.menuItem,
            isActive && estilosMenuLateral.activeMenuItem,
            { paddingLeft: 15 + (level * 20) }
          ]}
          onPress={() => {
            if (item.isExpandable) {
              toggleExpanded(item.name)
            } else if (item.screen) {
              props.navigation.navigate(item.screen)
              props.navigation.closeDrawer()
            }
          }}
        >
          <Icon
            name={item.icon}
            size={20}
            color={isActive ? '#fff' : isChild ? '#000' : '#ddd'}
            style={estilosMenuLateral.icon}
          />
          <Text style={[
            estilosMenuLateral.menuText,
            isActive && estilosMenuLateral.activeMenuText,
            isChild && estilosMenuLateral.childText
          ]}
          >
            {item.name}
          </Text>
          {item.isExpandable && (
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={isActive ? '#fff' : '#666'}
            />
          )}
        </TouchableOpacity>

        {item.isExpandable && isExpanded && item.children && (
          <View style={estilosMenuLateral.submenu}>
            {item.children.map((child, index) => (
              <MenuItem
                key={index}
                item={child}
                level={level + 1}
                isChild
              />
            ))}
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={estilosMenuLateral.container}>
      <View style={estilosMenuLateral.header}>
        <View style={estilosMenuLateral.logoContainer}>
          <Icon name='business' size={28} color='#fff' />
          <Text style={estilosMenuLateral.logoText}>Inicio</Text>
        </View>
      </View>

      <ScrollView style={estilosMenuLateral.menuList}>
        {LISTA_MENU.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </ScrollView>

      <View style={estilosMenuLateral.footer}>
        <Text style={estilosMenuLateral.footerText}>Hola mano</Text>
      </View>
    </View>
  )
}

const estilosMenuLateral = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3939a9'
  },
  header: {
    backgroundColor: '#3939a9',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6'
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10
  },
  menuList: {
    flex: 1,
    paddingVertical: 10
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 2
  },
  activeMenuItem: {
    backgroundColor: '#4545b9',
    borderRadius: 5
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#ddd',
    marginLeft: 10
  },
  activeMenuText: {
    color: '#fff',
    fontWeight: '600'
  },
  childText: {
    fontSize: 14,
    color: '#000'
  },
  submenu: {
    backgroundColor: '#e9ecef',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 4,
    marginVertical: 2
  },
  icon: {
    width: 24
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    alignItems: 'center'
  },
  footerText: {
    color: '#6c757d',
    fontSize: 12
  }
})

export default MenuLateral
