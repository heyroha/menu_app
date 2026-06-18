import React, { useState } from 'react'
import { Order } from '../types'

interface Props {
  orders: Order[]
  onRefresh: () => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const month = d.getMonth() + 1
  const day = d.getDate()
  const dayName = days[d.getDay()]
  const hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? '오후' : '오전'
  const h12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return {
    date: `${month}월 ${day}일 (${dayName})`,
    time: `${ampm} ${h12}:${minutes}`,
  }
}

function OrderNote({ order, displayNo, onClick }: { order: Order; displayNo: number; onClick: () => void }) {
  const { date, time } = formatDate(order.createdAt)
  const filledItems = order.items.filter(i => i.note?.trim() || (i as any).checked)

  return (
    <div
      className="order-note-wrapper"
      style={{ transform: `rotate(${order.rotation}deg)` }}
      onClick={onClick}
    >
      <div className="note-pin" />
      <div className="note-paper">
        <div className="note-order-no">no. {order.orderNumber ?? displayNo}</div>
        <div className="note-date">{date}</div>
        <div className="note-time">{time}</div>
        <div className="note-divider" />
        {filledItems.map(item => (
          <div key={item.id} className="note-item">
            <span className="note-item-emoji">{item.emoji}</span>
            <span className="note-item-name">
              {item.name}
              {item.note?.trim() && <span className="note-item-note"> — {item.note}</span>}
            </span>
          </div>
        ))}
        <div className="note-paw">🐾</div>
      </div>
    </div>
  )
}

function NoteDetail({ order, displayNo, onClose }: { order: Order; displayNo: number; onClose: () => void }) {
  const { date, time } = formatDate(order.createdAt)
  const filledItems = order.items.filter(i => i.note?.trim() || (i as any).checked)

  return (
    <div className="note-detail-overlay" onClick={onClose}>
      <div className="note-detail-box" onClick={e => e.stopPropagation()}>
        <div className="note-detail-pin" />
        <div className="note-detail-paper">
          <div className="note-detail-no">no. {order.orderNumber ?? displayNo}</div>
          <div className="note-detail-date">{date}</div>
          <div className="note-detail-time">{time}</div>
          <div className="note-divider" style={{ margin: '10px 0' }} />
          <div className="note-detail-items-scroll">
            {filledItems.map(item => (
              <div key={item.id} className="note-detail-item">
                <span className="note-detail-emoji">{item.emoji}</span>
                <div className="note-detail-text">
                  <span className="note-detail-name">{item.name}</span>
                  {item.note?.trim() && <span className="note-detail-note">{item.note}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="note-detail-paw">🐾</div>
        </div>
        <button className="note-detail-close" onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}

const DOTS = Array.from({ length: 80 }, (_, i) => ({
  top: Math.floor(i / 10) * 40 + (i % 3) * 7,
  left: (i % 10) * 38 + (i % 4) * 5,
  opacity: 0.15 + (i % 5) * 0.04,
}))

const PAGE_SIZE = 4

export default function KitchenTab({ orders, onRefresh }: Props) {
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Order | null>(null)
  const totalPages = Math.ceil(orders.length / PAGE_SIZE)
  const pageOrders = orders.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
  const leftCol = pageOrders.filter((_, i) => i % 2 === 0)
  const rightCol = pageOrders.filter((_, i) => i % 2 === 1)

  return (
    <div className="kitchen-tab">
      <div className="cork-dots">
        {DOTS.map((d, i) => (
          <div key={i} className="cork-dot" style={{ top: d.top, left: d.left, opacity: d.opacity }} />
        ))}
      </div>

      <div className="kitchen-header">
        <div className="kitchen-title">🐶 뭉뭉's 주방</div>
        <div className="kitchen-sub">메모지를 누르면 크게 볼 수 있어요</div>
      </div>

      {orders.length === 0 ? (
        <div className="kitchen-empty">
          <span className="kitchen-empty-dog">🐶</span>
          <span className="kitchen-empty-text">아직 주문이 없어요</span>
          <span className="kitchen-empty-sub">메뉴판에서 주문해봐요!</span>
        </div>
      ) : (
        <>
          <div className="notes-scroll">
            <div className="notes-grid">
              <div className="notes-column">
                {leftCol.map(o => (
                  <OrderNote
                    key={o.id}
                    order={o}
                    displayNo={orders.length - orders.indexOf(o)}
                    onClick={() => setSelected(o)}
                  />
                ))}
              </div>
              <div className="notes-column">
                {rightCol.map(o => (
                  <OrderNote
                    key={o.id}
                    order={o}
                    displayNo={orders.length - orders.indexOf(o)}
                    onClick={() => setSelected(o)}
                  />
                ))}
              </div>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="kitchen-pagination">
              <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                ← 이전
              </button>
              <span className="page-indicator">{page + 1} / {totalPages}</span>
              <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                최신 →
              </button>
            </div>
          )}
        </>
      )}

      {selected && (
        <NoteDetail
          order={selected}
          displayNo={orders.length - orders.indexOf(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
