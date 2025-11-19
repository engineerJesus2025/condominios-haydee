import { useState } from 'react'

export const useMenuLateral = () => {
  const [expandedItems, setExpandedItems] = useState({})

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }

  const isExpanded = (itemName) => !!expandedItems[itemName]

  return {
    expandedItems,
    toggleExpanded,
    isExpanded
  }
}
