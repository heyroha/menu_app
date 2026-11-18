import React from 'react'
import { Bell, Chef, FoodArt, Pencil } from './Art'

interface Props {
  onNavigate: (tab: 'menu' | 'kitchen' | 'edit') => void
}

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <div className="home-screen">
      <div className="home-hero">
        {/* 창문 · 식탁이 있는 작은 주방 장면 */}
        <div className="home-scene">
          <div className="scene-window" />
          <Chef size={170} className="home-chef" />
          <div className="scene-table" />
          <FoodArt icon="toast" size={46} className="scene-food left" />
          <FoodArt icon="milktea" size={44} className="scene-food right" />
        </div>
        <h1 className="home-title">오늘의 식탁</h1>
        <p className="home-sub">오늘 뭐 먹고 싶어?</p>
      </div>

      <div className="home-nav">
        <button className="home-nav-card" onClick={() => onNavigate('menu')}>
          <FoodArt icon="omurice" size={52} />
          <div><span className="home-nav-label">메뉴판</span><span className="home-nav-desc">먹고 싶은 메뉴를 골라요</span></div>
        </button>
        <button className="home-nav-card" onClick={() => onNavigate('kitchen')}>
          <Bell size={50} />
          <div><span className="home-nav-label">주방</span><span className="home-nav-desc">핀보드에 꽂힌 주문서를 봐요</span></div>
        </button>
        <button className="home-nav-card" onClick={() => onNavigate('edit')}>
          <Pencil size={48} />
          <div><span className="home-nav-label">메뉴 편집</span><span className="home-nav-desc">메뉴를 추가하고 관리해요</span></div>
        </button>
      </div>
    </div>
  )
}
