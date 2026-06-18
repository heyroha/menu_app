import React from 'react'

interface Props {
  onNavigate: (tab: 'menu' | 'kitchen' | 'edit') => void
}

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <div className="home-screen">
      <div className="home-hero">
        <div className="home-dog-circle">
          <span className="home-dog-emoji">🐶</span>
          <span className="home-chef-hat">👨‍🍳</span>
        </div>
        <h1 className="home-title">뭉뭉's 키친</h1>
        <p className="home-sub">오늘 뭐 먹고 싶어? 🍽️</p>
      </div>

      <div className="home-nav">
        <button className="home-nav-card" onClick={() => onNavigate('menu')}>
          <span className="home-nav-icon">🍽️</span>
          <div><span className="home-nav-label">메뉴판</span><span className="home-nav-desc">먹고 싶은 메뉴를 골라요</span></div>
        </button>
        <button className="home-nav-card" onClick={() => onNavigate('kitchen')}>
          <span className="home-nav-icon">👨‍🍳</span>
          <div><span className="home-nav-label">주방</span><span className="home-nav-desc">들어온 주문을 확인해요</span></div>
        </button>
        <button className="home-nav-card" onClick={() => onNavigate('edit')}>
          <span className="home-nav-icon">✏️</span>
          <div><span className="home-nav-label">메뉴 편집</span><span className="home-nav-desc">메뉴를 추가하고 관리해요</span></div>
        </button>
      </div>

      <div className="home-paws">
        <span>🐾</span><span>🐾</span><span>🐾</span>
      </div>
    </div>
  )
}
