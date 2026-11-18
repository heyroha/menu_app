import React, { useState, useRef } from 'react'
import { MenuItem } from '../types'
import { loadMenu, saveMenu, DEFAULT_MENU } from '../storage'
import { FOOD_ICONS, FOOD_LABEL, FoodArt, FoodIcon, iconOf } from './Art'
let idCounter = 200

function DraggableList({
  items,
  onReorder,
  renderItem,
}: {
  items: MenuItem[]
  onReorder: (newItems: MenuItem[]) => void
  renderItem: (item: MenuItem) => React.ReactNode
}) {
  const dragIndex = useRef<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  function getIndexFromY(y: number): number {
    if (!listRef.current) return 0
    const rows = listRef.current.querySelectorAll('.edit-row')
    for (let i = 0; i < rows.length; i++) {
      const rect = rows[i].getBoundingClientRect()
      if (y < rect.top + rect.height / 2) return i
    }
    return rows.length - 1
  }

  function onTouchStart(e: React.TouchEvent, index: number) {
    dragIndex.current = index
    setActiveIndex(index)
    setOverIndex(index)
  }

  function onTouchMove(e: React.TouchEvent) {
    e.preventDefault()
    const touch = e.touches[0]
    const over = getIndexFromY(touch.clientY)
    setOverIndex(over)
  }

  function onTouchEnd() {
    if (dragIndex.current !== null && overIndex !== null && dragIndex.current !== overIndex) {
      const newItems = [...items]
      const [moved] = newItems.splice(dragIndex.current, 1)
      newItems.splice(overIndex, 0, moved)
      onReorder(newItems)
    }
    dragIndex.current = null
    setActiveIndex(null)
    setOverIndex(null)
  }

  return (
    <div ref={listRef}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`edit-row${activeIndex === index ? ' dragging' : ''}${overIndex === index && activeIndex !== null && activeIndex !== index ? ' drag-over' : ''}`}
          onTouchStart={e => onTouchStart(e, index)}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <span className="drag-handle">⠿</span>
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}

export default function EditTab() {
  const [menu, setMenu] = useState<MenuItem[]>(loadMenu)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<'food' | 'drink'>('food')
  const [newIcon, setNewIcon] = useState<FoodIcon>('omurice')
  const [newBest, setNewBest] = useState(false)

  function deleteItem(id: string) {
    setMenu(prev => {
      const updated = prev.filter(item => item.id !== id)
      saveMenu(updated)
      return updated
    })
  }

  function toggleBest(id: string) {
    setMenu(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, isBest: !item.isBest } : item)
      saveMenu(updated)
      return updated
    })
  }

  function reorderSection(category: 'food' | 'drink', newSectionItems: MenuItem[]) {
    setMenu(prev => {
      const others = prev.filter(i => i.category !== category)
      const updated = category === 'food'
        ? [...newSectionItems, ...others]
        : [...others, ...newSectionItems]
      saveMenu(updated)
      return updated
    })
  }

  function addItem() {
    if (!newName.trim()) return
    const item: MenuItem = {
      id: String(Date.now() + idCounter++),
      name: newName.trim(),
      category: newCategory,
      icon: newIcon,
      emoji: '',
      isBest: newBest,
      note: '',
    }
    setMenu(prev => {
      const updated = [...prev, item]
      saveMenu(updated)
      return updated
    })
    setNewName('')
    setNewBest(false)
    setShowAdd(false)
  }

  function resetToDefault() {
    if (!confirm('기본 메뉴로 초기화할까요?')) return
    saveMenu(DEFAULT_MENU)
    setMenu(DEFAULT_MENU)
  }

  const food = menu.filter(i => i.category === 'food')
  const drinks = menu.filter(i => i.category === 'drink')

  function renderItemControls(item: MenuItem) {
    return (
      <>
        <FoodArt icon={iconOf(item)} size={34} className="menu-art" />
        <span className="edit-name">{item.name}</span>
        <button
          className={`best-toggle ${item.isBest ? 'on' : ''}`}
          onClick={() => toggleBest(item.id)}
          title="BEST 토글"
        >
          {item.isBest ? '★' : '☆'}
        </button>
        <button className="delete-btn" onClick={() => deleteItem(item.id)}>✕</button>
      </>
    )
  }

  return (
    <div className="edit-tab">
      <div className="menu-header">
        <h2 className="menu-header-title">메뉴 편집</h2>
        <div className="menu-header-line" />
      </div>

      <div className="menu-scroll" style={{ paddingBottom: 100 }}>
        <div className="menu-section">
          <div className="menu-section-label">음식 <span className="drag-hint">꾹 눌러서 순서 변경</span></div>
          <DraggableList
            items={food}
            onReorder={items => reorderSection('food', items)}
            renderItem={renderItemControls}
          />
        </div>

        <div className="menu-section">
          <div className="menu-section-label drink">음료 <span className="drag-hint">꾹 눌러서 순서 변경</span></div>
          <DraggableList
            items={drinks}
            onReorder={items => reorderSection('drink', items)}
            renderItem={renderItemControls}
          />
        </div>

        <button className="reset-btn" onClick={resetToDefault}>기본 메뉴로 초기화</button>
      </div>

      <div className="order-bar">
        <button className="order-btn" onClick={() => setShowAdd(true)}>+ 메뉴 추가하기</button>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">메뉴 추가하기</div>

            <div className="modal-label">메뉴 이름</div>
            <input
              className="modal-input"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="예: 김치찌개"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && addItem()}
            />

            <div className="modal-label">카테고리</div>
            <div className="category-row">
              <button className={`category-btn ${newCategory === 'food' ? 'active' : ''}`} onClick={() => setNewCategory('food')}>음식</button>
              <button className={`category-btn ${newCategory === 'drink' ? 'active' : ''}`} onClick={() => setNewCategory('drink')}>음료</button>
            </div>

            <div className="modal-label">그림 <span className="drag-hint">{FOOD_LABEL[newIcon]}</span></div>
            <div className="icon-grid">
              {FOOD_ICONS.map(ic => (
                <button key={ic} className={`icon-btn ${newIcon === ic ? 'active' : ''}`} onClick={() => setNewIcon(ic)} title={FOOD_LABEL[ic]}>
                  <FoodArt icon={ic} size={40} />
                </button>
              ))}
            </div>

            <div className="modal-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={newBest} onChange={e => setNewBest(e.target.checked)} id="best-check" style={{ width: 18, height: 18 }} />
              <label htmlFor="best-check" style={{ cursor: 'pointer' }}>BEST 메뉴로 표시</label>
            </div>

            <button className="modal-add-btn" style={{ marginTop: 16 }} onClick={addItem}>추가하기</button>
          </div>
        </div>
      )}
    </div>
  )
}
