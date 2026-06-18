import { MenuItem, Order } from './types'
import { supabase } from './supabase'

const MENU_KEY = 'mungmung_menu'

export const DEFAULT_MENU: MenuItem[] = [
  { id: '1', name: '왕어묵포치떡볶이', category: 'food', emoji: '🍢', note: '' },
  { id: '2', name: '감태주먹밥', category: 'food', emoji: '🍙', note: '' },
  { id: '3', name: '홍콩토스트', category: 'food', emoji: '🍞', note: '' },
  { id: '4', name: '도산비빔면', category: 'food', emoji: '🍜', isBest: true, note: '' },
  { id: '5', name: '육개장라면', category: 'food', emoji: '🍜', note: '' },
  { id: '6', name: '김치볶음밥', category: 'food', emoji: '🍚', note: '' },
  { id: '7', name: '명란버터라이스', category: 'food', emoji: '🍚', note: '' },
  { id: '8', name: '코코넛커리라이스', category: 'food', emoji: '🍛', note: '' },
  { id: '9', name: '토마토새우볶음밥', category: 'food', emoji: '🍚', note: '' },
  { id: '10', name: '돈까스샌드', category: 'food', emoji: '🥪', isBest: true, note: '' },
  { id: '11', name: '공기밥', category: 'food', emoji: '🍚', note: '' },
  { id: '12', name: '콜라 병(소)', category: 'drink', emoji: '🥤', note: '' },
  { id: '13', name: '사이다 병(소)', category: 'drink', emoji: '🥤', note: '' },
  { id: '14', name: '미린다 병(대)', category: 'drink', emoji: '🍊', note: '' },
  { id: '15', name: '맥콜 캔(소)', category: 'drink', emoji: '🥤', note: '' },
  { id: '16', name: '도산 밀크티', category: 'drink', emoji: '🧋', isBest: true, note: '' },
  { id: '17', name: '쿨피스', category: 'drink', emoji: '🥛', note: '' },
]

export function loadMenu(): MenuItem[] {
  try {
    const json = localStorage.getItem(MENU_KEY)
    if (json) {
      const parsed = JSON.parse(json) as any[]
      return parsed.map(item => ({
        ...item,
        note: item.note ?? (item.checked ? '1개' : ''),
      }))
    }
  } catch {}
  return DEFAULT_MENU
}

export function saveMenu(menu: MenuItem[]) {
  localStorage.setItem(MENU_KEY, JSON.stringify(menu))
}

export async function loadOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('loadOrders error:', error)
    return []
  }
  return (data ?? []).map(row => ({
    id: row.id,
    orderNumber: row.order_number,
    items: row.items,
    createdAt: row.created_at,
    rotation: row.rotation,
  }))
}

export async function saveOrder(order: Order): Promise<void> {
  const { error } = await supabase.from('orders').insert({
    id: order.id,
    order_number: order.orderNumber,
    items: order.items,
    created_at: order.createdAt,
    rotation: order.rotation,
  })
  if (error) console.error('saveOrder error:', error)
}

export async function getNextOrderNumber(): Promise<number> {
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
  return (count ?? 0) + 1
}
