import React, { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import HomeScreen from './components/HomeScreen'
import MenuTab from './components/MenuTab'
import KitchenTab from './components/KitchenTab'
import EditTab from './components/EditTab'
import { loadOrders } from './storage'
import { supabase } from './supabase'
import { Order } from './types'
import './app.css'

type Screen = 'home' | 'menu' | 'kitchen' | 'edit'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [screen, setScreen] = useState<Screen>('home')
  const [kitchenOrders, setKitchenOrders] = useState<Order[]>([])

  async function refreshOrders() {
    const orders = await loadOrders()
    setKitchenOrders(orders)
  }

  useEffect(() => {
    refreshOrders()

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        refreshOrders()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen onNavigate={setScreen} />
      )}
      {screen !== 'home' && (
        <>
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('home')}>
              ← 홈
            </button>
            <span className="screen-title">
              {screen === 'menu' && '🍽️ 메뉴판'}
              {screen === 'kitchen' && '👨‍🍳 주방'}
              {screen === 'edit' && '✏️ 메뉴 편집'}
            </span>
            <span style={{ width: 60 }} />
          </div>
          <div className="tab-content">
            {screen === 'menu' && <MenuTab onOrder={refreshOrders} />}
            {screen === 'kitchen' && (
              <KitchenTab
                orders={kitchenOrders}
                onRefresh={refreshOrders}
              />
            )}
            {screen === 'edit' && <EditTab />}
          </div>
        </>
      )}
    </div>
  )
}
