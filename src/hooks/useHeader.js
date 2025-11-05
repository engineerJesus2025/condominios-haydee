import { useState } from 'react'

export default function useHeader () {
  const [notificationsVisible, setNotificationsVisible] = useState(false)
  const [userMenuVisible, setUserMenuVisible] = useState(false)

  const toggleNotifications = () => {
    setNotificationsVisible(!notificationsVisible)
    setUserMenuVisible(false) // Cierra el otro menú
  }

  const toggleUserMenu = () => {
    setUserMenuVisible(!userMenuVisible)
    setNotificationsVisible(false) // Cierra el otro menú
  }

  const closeMenus = () => {
    setNotificationsVisible(false)
    setUserMenuVisible(false)
  }

  return [notificationsVisible, userMenuVisible, toggleNotifications, toggleUserMenu, closeMenus]
}
