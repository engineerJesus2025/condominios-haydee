import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { getEstilosMenuLatelalItem } from '../styles/components/estilosMenuLatelalItem'
import { useTema } from '../hooks/useTema'

export default function MenuLateralItem ({ item, level = 0, isChild = false, isActive = false, isExpanded = false, onItemPress, onToggleExpand }) {
  if (!item.permission) return null

  const { colores } = useTema()
  const estilosMenuLateral = getEstilosMenuLatelalItem(colores)

  const handlePress = () => {
    if (item.isExpandable) {
      onToggleExpand(item.name)
    } else if (item.screen) {
      onItemPress(item)
    }
  }

  return (
    <View>
      <TouchableOpacity
        style={[
          estilosMenuLateral.menuItem,
          isActive && estilosMenuLateral.activeMenuItem,
          { paddingLeft: 15 + (level * 20) }
        ]}
        onPress={handlePress}
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
            <MenuLateralItem
              key={index}
              item={child}
              level={level + 1}
              isChild
              isActive={isActive}
              isExpanded={isExpanded}
              onItemPress={onItemPress}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </View>
      )}
    </View>
  )
}
