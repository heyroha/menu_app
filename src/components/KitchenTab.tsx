import React, { useState } from 'react'
import { MenuItem, Order } from '../types'
import { Bow, Chef, FoodArt, SewButton, iconOf } from './Art'

interface Props {
  orders: Order[]
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? '오후' : '오전'
  const h12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return {
    date: `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`,
    time: `${ampm} ${h12}:${minutes}`,
  }
}

type LegacyItem = MenuItem & { checked?: boolean }
const filledOf = (order: Order) => (order.items as LegacyItem[]).filter(i => i.note?.trim() || i.checked)

// 주문서마다 종이 색과 꽂는 방법(단추 · 리본 · 마스킹테이프)을 번갈아 쓴다
const PAPERS = ['#fffdf8', '#fff6e0', '#ffeef2', '#eef6ff']
const BUTTONS = ['#bcdcf5', '#ffc9d4', '#ffe38a', '#bfe3c0']
type Fastener = 'button' | 'bow' | 'tape'
const FASTENERS: Fastener[] = ['button', 'bow', 'tape', 'button']

function Fasten({ kind, n }: { kind: Fastener; n: number }) {
  if (kind === 'bow') return <span className="fasten bow"><Bow size={44} /></span>
  if (kind === 'tape') return <span className="fasten tape" style={{ background: BUTTONS[(n + 1) % 4] }} />
  return <span className="fasten button"><SewButton color={BUTTONS[n % 4]} size={28} /></span>
}

function OrderNote({ order, displayNo, onClick }: { order: Order; displayNo: number; onClick: () => void }) {
  const { date, time } = formatDate(order.createdAt)
  const no = order.orderNumber ?? displayNo
  return (
    <button className="order-note" style={{ transform: `rotate(${order.rotation}deg)` }} onClick={onClick}>
      <Fasten kind={FASTENERS[no % 4]} n={no} />
      <div className="note-paper" style={{ background: PAPERS[no % 4] }}>
        <div className="note-order-no">no. {no}</div>
        <div className="note-date">{date} · {time}</div>
        <div className="note-divider" />
        {filledOf(order).map(item => (
          <div key={item.id} className="note-item">
            <FoodArt icon={iconOf(item)} size={24} />
            <span className="note-item-name">
              {item.name}
              {item.note?.trim() && <span className="note-item-note"> — {item.note}</span>}
            </span>
          </div>
        ))}
      </div>
    </button>
  )
}

function NoteDetail({ order, displayNo, onClose }: { order: Order; displayNo: number; onClose: () => void }) {
  const { date, time } = formatDate(order.createdAt)
  const no = order.orderNumber ?? displayNo
  return (
    <div className="note-detail-overlay" onClick={onClose}>
      <div className="note-detail-box" onClick={e => e.stopPropagation()}>
        <span className="fasten bow detail"><Bow size={64} color="#ffc9d4" /></span>
        <div className="note-detail-paper" style={{ background: PAPERS[no % 4] }}>
          <div className="note-detail-no">no. {no}</div>
          <div className="note-detail-date">{date}</div>
          <div className="note-detail-time">{time}</div>
          <div className="note-divider" style={{ margin: '10px 0' }} />
          <div className="note-detail-items-scroll">
            {filledOf(order).map(item => (
              <div key={item.id} className="note-detail-item">
                <FoodArt icon={iconOf(item)} size={46} />
                <div className="note-detail-text">
                  <span className="note-detail-name">{item.name}</span>
                  {item.note?.trim() && <span className="note-detail-note">{item.note}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="note-detail-close" onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}

const PAGE_SIZE = 4

export default function KitchenTab({ orders }: Props) {
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Order | null>(null)
  const totalPages = Math.ceil(orders.length / PAGE_SIZE)
  const pageOrders = orders.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
  const leftCol = pageOrders.filter((_, i) => i % 2 === 0)
  const rightCol = pageOrders.filter((_, i) => i % 2 === 1)
  const displayNo = (o: Order) => orders.length - orders.indexOf(o)

  return (
    <div className="kitchen-tab">
      <div className="kitchen-header">
        <Chef size={64} />
        <div>
          <div className="kitchen-title">오늘의 주방</div>
          <div className="kitchen-sub">주문서를 누르면 크게 볼 수 있어요</div>
        </div>
      </div>

      {/* 나무 액자 + 깅엄 천 + 레이스 테두리 핀보드 */}
      <div className="pinboard">
        <div className="pinboard-fabric">
          <div className="pinboard-lace" />
          {/* 흩어 둔 장식 */}
          <span className="deco" style={{ left: '6%', bottom: '5%' }}><SewButton color="#ffc9d4" size={22} /></span>
          <span className="deco" style={{ left: '14%', bottom: '3%' }}><SewButton color="#bcdcf5" size={18} /></span>
          <span className="deco" style={{ right: '8%', bottom: '4%' }}><Bow size={34} /></span>
          <span className="deco" style={{ right: '42%', bottom: '2.5%' }}><SewButton color="#ffe38a" size={20} /></span>

          {orders.length === 0 ? (
            <div className="kitchen-empty">
              <FoodArt icon="rice" size={80} />
              <span className="kitchen-empty-text">아직 주문이 없어요</span>
              <span className="kitchen-empty-sub">메뉴판에서 주문해 봐요!</span>
            </div>
          ) : (
            <div className="notes-scroll">
              <div className="notes-grid">
                <div className="notes-column">
                  {leftCol.map(o => <OrderNote key={o.id} order={o} displayNo={displayNo(o)} onClick={() => setSelected(o)} />)}
                </div>
                <div className="notes-column">
                  {rightCol.map(o => <OrderNote key={o.id} order={o} displayNo={displayNo(o)} onClick={() => setSelected(o)} />)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="kitchen-pagination">
          <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>← 이전</button>
          <span className="page-indicator">{page + 1} / {totalPages}</span>
          <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 0}>최신 →</button>
        </div>
      )}

      {selected && <NoteDetail order={selected} displayNo={displayNo(selected)} onClose={() => setSelected(null)} />}
    </div>
  )
}
