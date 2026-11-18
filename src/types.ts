import type { FoodIcon } from './components/Art'

export interface MenuItem {
  id: string
  name: string
  category: 'food' | 'drink'
  /** 예전 버전에서 쓰던 이모지 (icon 이 없을 때 일러스트를 고르는 데 쓴다) */
  emoji: string
  /** 메뉴 옆에 보여 줄 음식 일러스트 */
  icon?: FoodIcon
  isBest?: boolean
  note: string
}

export interface Order {
  id: string
  orderNumber?: number
  items: MenuItem[]
  createdAt: string
  rotation: number
}
