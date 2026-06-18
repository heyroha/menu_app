import React, { useState } from 'react'

const EMOJIS = ['🍜', '🍚', '🍙', '🍞', '🥪', '🍢', '🍛', '🥘', '🍳', '🥗', '🍖', '🍗', '🥤', '🧋', '🥛', '🍊', '☕', '🧃']

interface Props {
  onClose: () => void
  onAdd: (name: string, category: 'food' | 'drink', emoji: string) => void
}

export default function AddMenuModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<'food' | 'drink'>('food')
  const [emoji, setEmoji] = useState('🍜')

  function handleAdd() {
    if (!name.trim()) return
    onAdd(name.trim(), category, emoji)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">메뉴 추가하기 🍽️</div>

        <div className="modal-label">메뉴 이름</div>
        <input
          className="modal-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="예: 김치찌개"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />

        <div className="modal-label">카테고리</div>
        <div className="category-row">
          <button className={`category-btn ${category === 'food' ? 'active' : ''}`} onClick={() => setCategory('food')}>🍽 음식</button>
          <button className={`category-btn ${category === 'drink' ? 'active' : ''}`} onClick={() => setCategory('drink')}>🥤 음료</button>
        </div>

        <div className="modal-label">이모지</div>
        <div className="emoji-scroll">
          {EMOJIS.map(e => (
            <button key={e} className={`emoji-btn ${emoji === e ? 'active' : ''}`} onClick={() => setEmoji(e)}>{e}</button>
          ))}
        </div>

        <button className="modal-add-btn" onClick={handleAdd}>추가하기 ✓</button>
      </div>
    </div>
  )
}
