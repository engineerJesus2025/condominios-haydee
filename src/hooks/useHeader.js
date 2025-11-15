import { useState } from 'react'

export default function useHeader () {
  const [userMenuVisible, setUserMenuVisible] = useState(false)

  const toggleUserMenu = () => {
    setUserMenuVisible(!userMenuVisible)
  }

  const closeMenus = () => {
    setUserMenuVisible(false)
  }

  return [userMenuVisible, toggleUserMenu, closeMenus]
}
