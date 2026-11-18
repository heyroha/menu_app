import React, { useState, useEffect, useRef } from 'react'
import SplashScreen from './components/SplashScreen'
import HomeScreen from './components/HomeScreen'
import MenuTab from './components/MenuTab'
import KitchenTab from './components/KitchenTab'
import EditTab from './components/EditTab'
import { Bell, FoodArt, Pencil } from './components/Art'
import { loadOrders } from './storage'
import { supabase } from './supabase'
import { playKitchenBell } from './sound'
import { Order } from './types'
import './app.css'

type Screen = 'home' | 'menu' | 'kitchen' | 'edit'

const TITLES: Record<Exclude<Screen, 'home'>, { label: string; icon: React.ReactNode }> = {
  menu: { label: '메뉴판', icon: <FoodArt icon="omurice" size={34} /> },
  kitchen: { label: '주방', icon: <Bell size={32} /> },
  edit: { label: '메뉴 편집', icon: <Pencil size={30} /> },
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [screen, setScreen] = useState<Screen>('home')
  const [kitchenOrders, setKitchenOrders] = useState<Order[]>([])
  const screenRef = useRef(screen)
  screenRef.current = screen
  const knownIds = useRef<Set<string> | null>(null)

  async function refreshOrders() {
    const orders = await loadOrders()
    // 주방 화면을 보고 있을 때 새 주문이 들어오면 벨을 울린다
    if (knownIds.current && screenRef.current === 'kitchen' && orders.some(o => !knownIds.current!.has(o.id))) {
      playKitchenBell()
    }
    knownIds.current = new Set(orders.map(o => o.id))
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
      {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
      {screen !== 'home' && (
        <>
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('home')}>← 홈</button>
            <span className="screen-title">
              {TITLES[screen].icon}
              {TITLES[screen].label}
            </span>
            <span style={{ width: 60 }} />
          </div>
          <div className="tab-content">
            {screen === 'menu' && <MenuTab onOrder={refreshOrders} />}
            {screen === 'kitchen' && <KitchenTab orders={kitchenOrders} />}
            {screen === 'edit' && <EditTab />}
          </div>
        </>
      )}
    </div>
  )
}
