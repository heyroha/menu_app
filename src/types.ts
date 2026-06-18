export interface MenuItem {
  id: string
  name: string
  category: 'food' | 'drink'
  emoji: string
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
