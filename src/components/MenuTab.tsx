import React, { useState, useEffect } from 'react'
import { MenuItem, Order } from '../types'
import { loadMenu, saveMenu, saveOrder, getNextOrderNumber } from '../storage'
import { playOrderBell } from '../sound'
import { Bell, Chef, FoodArt, iconOf } from './Art'

interface Props {
  onOrder: () => void
}

function MenuRow({ item, onNote }: { item: MenuItem; onNote: (id: string, note: string) => void }) {
  return (
    <div className={`menu-row ${item.note.trim() ? 'filled' : ''}`}>
      <div className="menu-row-left">
        <FoodArt icon={iconOf(item)} size={40} className="menu-art" />
        <span className="menu-name">{item.name}</span>
        {item.isBest && <span className="best-badge">BEST</span>}
      </div>
      <input
        className="menu-note-input"
        value={item.note}
        onChange={e => onNote(item.id, e.target.value)}
        placeholder="메모"
      />
    </div>
  )
}

export default function MenuTab({ onOrder }: Props) {
  const [menu, setMenu] = useState<MenuItem[]>(loadMenu)
  const [showSuccess, setShowSuccess] = useState(false)
  const [ringing, setRinging] = useState(false)
  const [orderNo, setOrderNo] = useState<number>(1)
  const [currentOrderNo, setCurrentOrderNo] = useState<number>(1)

  useEffect(() => {
    getNextOrderNumber().then(setCurrentOrderNo)
  }, [])

  function updateNote(id: string, note: string) {
    setMenu(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, note } : item)
      saveMenu(updated)
      return updated
    })
  }

  async function handleOrder() {
    const filled = menu.filter(i => i.note.trim())
    if (!filled.length || ringing) return

    // 버튼을 누르자마자 벨을 울린다 (소리는 사용자 탭 안에서 시작해야 모바일에서도 난다)
    playOrderBell()
    setRinging(true)

    const no = await getNextOrderNumber()
    const order: Order = {
      id: String(Date.now()),
      orderNumber: no,
      items: menu,
      createdAt: new Date().toISOString(),
      rotation: Math.random() * 6 - 3,
    }
    await saveOrder(order)
    onOrder()
    setOrderNo(no)
    setCurrentOrderNo(no + 1)
    setShowSuccess(true)

    setMenu(prev => {
      const cleared = prev.map(i => ({ ...i, note: '' }))
      saveMenu(cleared)
      return cleared
    })

    setTimeout(() => setRinging(false), 700)
    setTimeout(() => setShowSuccess(false), 2200)
  }

  const food = menu.filter(i => i.category === 'food')
  const drinks = menu.filter(i => i.category === 'drink')
  const filledCount = menu.filter(i => i.note.trim()).length

  return (
    <div className="menu-tab">
      <div className="menu-scroll">
        <div className="menu-paper">
          <div className="menu-header">
            <span className="menu-header-no">no. {currentOrderNo}</span>
            <h2 className="menu-header-title">오늘의 식탁 메뉴판</h2>
            <div className="menu-header-line" />
          </div>

          <div className="menu-section">
            <div className="menu-section-label">음식</div>
            {food.map(item => <MenuRow key={item.id} item={item} onNote={updateNote} />)}
          </div>

          <div className="menu-section">
            <div className="menu-section-label drink">음료</div>
            {drinks.map(item => <MenuRow key={item.id} item={item} onNote={updateNote} />)}
          </div>
        </div>
      </div>

      <div className="order-bar">
        <button className={`order-btn ${ringing ? 'ringing' : ''}`} onClick={handleOrder} disabled={filledCount === 0}>
          <Bell size={34} className="order-bell" />
          {filledCount > 0 ? `띵! 주문하기 (${filledCount}개)` : '메뉴에 메모를 적어 주세요'}
        </button>
      </div>

      {showSuccess && (
        <div className="toast-overlay">
          <div className="toast-box">
            <Chef size={96} />
            <span className="toast-text">no. {orderNo} 주문서가<br />주방에 쏙 들어갔어요!</span>
          </div>
        </div>
      )}
    </div>
  )
}
