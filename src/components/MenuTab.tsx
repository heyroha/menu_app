import React, { useState, useEffect } from 'react'
import { MenuItem, Order } from '../types'
import { loadMenu, saveMenu, saveOrder, getNextOrderNumber } from '../storage'

interface Props {
  onOrder: () => void
}

export default function MenuTab({ onOrder }: Props) {
  const [menu, setMenu] = useState<MenuItem[]>(loadMenu)
  const [showSuccess, setShowSuccess] = useState(false)
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
    if (!filled.length) return

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

    setTimeout(() => setShowSuccess(false), 2200)
  }

  const food = menu.filter(i => i.category === 'food')
  const drinks = menu.filter(i => i.category === 'drink')
  const filledCount = menu.filter(i => i.note.trim()).length

  return (
    <div className="menu-tab">
      <div className="menu-header">
        <span className="menu-header-no">no. {currentOrderNo}</span>
        <h2 className="menu-header-title">뭉뭉식탁 메뉴판</h2>
        <div className="menu-header-line" />
      </div>

      <div className="menu-scroll">
        <div className="menu-section">
          <div className="menu-section-label">🍽 음식</div>
          {food.map(item => (
            <div key={item.id} className={`menu-row ${item.note.trim() ? 'filled' : ''}`}>
              <div className="menu-row-left">
                <span className="menu-emoji">{item.emoji}</span>
                <span className="menu-name">{item.name}</span>
                {item.isBest && <span className="best-badge">BEST</span>}
              </div>
              <input
                className="menu-note-input"
                value={item.note}
                onChange={e => updateNote(item.id, e.target.value)}
                placeholder="메모"
              />
            </div>
          ))}
        </div>

        <div className="menu-section">
          <div className="menu-section-label">🥤 음료</div>
          {drinks.map(item => (
            <div key={item.id} className={`menu-row ${item.note.trim() ? 'filled' : ''}`}>
              <div className="menu-row-left">
                <span className="menu-emoji">{item.emoji}</span>
                <span className="menu-name">{item.name}</span>
                {item.isBest && <span className="best-badge">BEST</span>}
              </div>
              <input
                className="menu-note-input"
                value={item.note}
                onChange={e => updateNote(item.id, e.target.value)}
                placeholder="메모"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="order-bar">
        <button className="order-btn" onClick={handleOrder} disabled={filledCount === 0}>
          {filledCount > 0 ? `🐾 주문하기! (${filledCount}개)` : '메뉴에 메모를 입력해주세요'}
        </button>
      </div>

      {showSuccess && (
        <div className="toast-overlay">
          <div className="toast-box">
            <span className="toast-dog">🐶</span>
            <span className="toast-text">no. {orderNo} 주문서가 접수되었습니다!</span>
          </div>
        </div>
      )}
    </div>
  )
}
