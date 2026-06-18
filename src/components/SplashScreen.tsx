import React, { useEffect } from 'react'

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const t = setTimeout(onFinish, 2800)
    return () => clearTimeout(t)
  }, [onFinish])

  return (
    <div className="splash">
      <div className="splash-dog">
        <span className="splash-dog-emoji">🐶</span>
        <span className="splash-chef">👨‍🍳</span>
      </div>
      <h1 className="splash-title">뭉뭉's 키친</h1>
      <p className="splash-sub">오늘 뭐 먹고 싶어? 🍽️</p>
      <div className="splash-paws">
        <span>🐾</span><span>🐾</span><span>🐾</span>
      </div>
    </div>
  )
}
