import React, { useEffect } from 'react'
import { Chef, FoodArt } from './Art'

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const t = setTimeout(onFinish, 2800)
    return () => clearTimeout(t)
  }, [onFinish])

  return (
    <div className="splash" onClick={onFinish}>
      <Chef size={190} className="splash-chef" />
      <h1 className="splash-title">오늘의 식탁</h1>
      <p className="splash-sub">오늘 뭐 먹고 싶어?</p>
      <div className="splash-foods">
        <FoodArt icon="onigiri" size={40} />
        <FoodArt icon="toast" size={40} />
        <FoodArt icon="milktea" size={40} />
      </div>
    </div>
  )
}
