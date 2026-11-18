import React from 'react'
import { MenuItem } from '../types'

/**
 * 색연필로 그린 듯한 일러스트 모음 (직접 그린 SVG).
 * index.html 의 #wobble · #pencil-grain 필터로 선은 살짝 흔들리고 면에는 색연필 결이 남는다.
 */

const INK = '#5b3a29'
const BLUSH = '#ff9e9e'
const SKIN = '#fde3cc'
const HAIR = '#8a5a3b'
const EGG = '#ffd96a'
const KETCHUP = '#e8553f'
const RICE = '#fffdf6'
const GREEN = '#a8d08d'

export const FOOD_ICONS = [
  'omurice', 'toast', 'tteokbokki', 'onigiri', 'bibim-noodle', 'ramen', 'fried-rice', 'rice',
  'curry', 'sandwich', 'shrimp-rice', 'mentai-rice', 'salad',
  'cola', 'cider', 'orange-soda', 'can', 'milktea', 'yogurt', 'coffee',
] as const
export type FoodIcon = (typeof FOOD_ICONS)[number]

export const FOOD_LABEL: Record<FoodIcon, string> = {
  omurice: '오므라이스', toast: '토스트', tteokbokki: '떡볶이', onigiri: '주먹밥', 'bibim-noodle': '비빔면',
  ramen: '라면', 'fried-rice': '볶음밥', rice: '공기밥', curry: '카레', sandwich: '샌드위치',
  'shrimp-rice': '새우밥', 'mentai-rice': '명란밥', salad: '샐러드', cola: '콜라', cider: '사이다',
  'orange-soda': '오렌지 탄산', can: '캔음료', milktea: '밀크티', yogurt: '요구르트', coffee: '커피',
}

// 예전에 이모지로 저장된 메뉴 · 주문도 일러스트로 보여 주기 위한 대응표
const EMOJI_TO_ICON: Record<string, FoodIcon> = {
  '🍢': 'tteokbokki', '🍙': 'onigiri', '🍞': 'toast', '🍜': 'ramen', '🍚': 'rice', '🍛': 'curry',
  '🥪': 'sandwich', '🍳': 'omurice', '🥗': 'salad', '🥘': 'fried-rice', '🍖': 'fried-rice', '🍗': 'fried-rice',
  '🥤': 'cola', '🧋': 'milktea', '🥛': 'yogurt', '🍊': 'orange-soda', '☕': 'coffee', '🧃': 'yogurt',
}

export function isFoodIcon(v: unknown): v is FoodIcon {
  return typeof v === 'string' && (FOOD_ICONS as readonly string[]).includes(v)
}

export function iconOf(item: Pick<MenuItem, 'icon' | 'emoji' | 'category'>): FoodIcon {
  if (isFoodIcon(item.icon)) return item.icon
  return EMOJI_TO_ICON[item.emoji] ?? (item.category === 'drink' ? 'cola' : 'rice')
}

function Svg({ size, vb = '0 0 100 100', children, className, title, sticker }: {
  size: number | string; vb?: string; children: React.ReactNode; className?: string; title?: string; sticker?: boolean
}) {
  const stroke = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
  return (
    <svg viewBox={vb} width={size} height={size} className={className}
      role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g filter={sticker ? 'url(#sticker)' : undefined}>
        {/* 본체는 불투명하게 그리고, 같은 그림에 색연필 결만 한 겹 더 얹는다 */}
        <g filter="url(#wobble)" {...stroke}>{children}</g>
        <g filter="url(#pencil-grain)" opacity={0.28} {...stroke}>{children}</g>
      </g>
    </svg>
  )
}

/** 점 눈 · 볼터치 · 입 (cx, cy 가 얼굴 중심) */
function Face({ cx, cy, s = 1, mouth = 'smile' }: { cx: number; cy: number; s?: number; mouth?: 'smile' | 'o' | 'w' }) {
  const e = 7 * s
  return (
    <g>
      <circle cx={cx - e} cy={cy} r={2.4 * s} fill={INK} stroke="none" />
      <circle cx={cx + e} cy={cy} r={2.4 * s} fill={INK} stroke="none" />
      <ellipse cx={cx - e - 4 * s} cy={cy + 5 * s} rx={3.6 * s} ry={2.2 * s} fill={BLUSH} stroke="none" opacity={0.75} />
      <ellipse cx={cx + e + 4 * s} cy={cy + 5 * s} rx={3.6 * s} ry={2.2 * s} fill={BLUSH} stroke="none" opacity={0.75} />
      {mouth === 'smile' && <path d={`M${cx - 2.5 * s} ${cy + 3 * s} q${2.5 * s} ${3 * s} ${5 * s} 0`} strokeWidth={2 * s} />}
      {mouth === 'o' && <circle cx={cx} cy={cy + 4 * s} r={1.8 * s} strokeWidth={1.8 * s} />}
      {mouth === 'w' && <path d={`M${cx - 4 * s} ${cy + 3 * s} q${2 * s} ${3 * s} ${4 * s} 0 q${2 * s} ${3 * s} ${4 * s} 0`} strokeWidth={1.8 * s} />}
    </g>
  )
}

function Plate({ y = 78, rx = 42 }: { y?: number; rx?: number }) {
  return <ellipse cx="50" cy={y} rx={rx} ry={12} fill="#fff" />
}
function Bowl({ color = '#fff', band }: { color?: string; band?: string }) {
  return (
    <>
      <path d="M12 52 H88 C88 74 72 88 50 88 C28 88 12 74 12 52 Z" fill={color} />
      {band && <path d="M16 64 H84" stroke={band} strokeWidth={4} />}
    </>
  )
}
function Bottle({ body, label, cap = '#e8553f' }: { body: string; label: string; cap?: string }) {
  return (
    <>
      <path d="M42 10 H58 V24 C58 30 70 34 70 48 V86 C70 91 66 94 61 94 H39 C34 94 30 91 30 86 V48 C30 34 42 30 42 24 Z" fill={body} />
      <rect x="40" y="6" width="20" height="8" rx="2" fill={cap} />
      <rect x="30" y="54" width="40" height="22" fill={label} />
      <Face cx={50} cy={63} s={0.8} />
    </>
  )
}

export function FoodArt({ icon, size = 44, className }: { icon: FoodIcon; size?: number | string; className?: string }) {
  return <Svg size={size} className={className} title={FOOD_LABEL[icon]}>{food(icon)}</Svg>
}

function food(icon: FoodIcon) {
  switch (icon) {
    case 'omurice':
      return (
        <>
          <Plate />
          <path d="M14 66 C14 44 34 36 50 36 C66 36 86 44 86 66 C86 76 70 80 50 80 C30 80 14 76 14 66 Z" fill={EGG} />
          {/* 케첩으로 그린 곰 얼굴 */}
          <g stroke={KETCHUP} strokeWidth={3.2}>
            <circle cx="50" cy="60" r="12" />
            <circle cx="40" cy="48" r="4" />
            <circle cx="60" cy="48" r="4" />
          </g>
          <circle cx="45.5" cy="58" r="1.8" fill={KETCHUP} stroke="none" />
          <circle cx="54.5" cy="58" r="1.8" fill={KETCHUP} stroke="none" />
          <path d="M47 64 q3 3 6 0" stroke={KETCHUP} strokeWidth={2.2} />
          <path d="M24 58 l2 -4 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 z" fill={KETCHUP} stroke="none" />
          <path d="M72 60 l2 -4 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 z" fill={KETCHUP} stroke="none" />
          <path d="M80 72 q4 -6 10 -4" stroke="#7cb26a" strokeWidth={4} />
        </>
      )
    case 'toast':
      return (
        <>
          <path d="M20 88 V40 C12 38 12 18 30 16 C40 8 60 8 70 16 C88 18 88 38 80 40 V88 Z" fill="#e7b678" />
          <path d="M26 82 V44 C20 42 20 26 33 24 C42 18 58 18 67 24 C80 26 80 42 74 44 V82 Z" fill="#fffaf0" stroke="none" />
          <circle cx="36" cy="30" r="5" fill="#e04a5a" stroke="none" />
          <circle cx="64" cy="30" r="5" fill="#e04a5a" stroke="none" />
          <Face cx={50} cy={56} s={1.1} mouth="w" />
        </>
      )
    case 'tteokbokki':
      return (
        <>
          <Plate y={74} />
          <path d="M14 70 C16 56 32 50 50 50 C68 50 84 56 86 70 C70 80 30 80 14 70 Z" fill="#f06a4f" />
          <rect x="24" y="54" width="22" height="10" rx="5" fill="#fff4ea" transform="rotate(-12 35 59)" />
          <rect x="52" y="58" width="22" height="10" rx="5" fill="#fff4ea" transform="rotate(10 63 63)" />
          <rect x="40" y="64" width="20" height="9" rx="4.5" fill="#fff4ea" />
          <path d="M62 50 L84 18" strokeWidth={2.4} />
          <path d="M66 22 C76 18 84 26 78 34 C72 42 62 36 66 22 Z" fill="#f2c98e" />
          <Face cx={50} cy={67} s={0.55} />
        </>
      )
    case 'onigiri':
      return (
        <>
          <path d="M50 12 C58 12 90 66 86 80 C84 88 16 88 14 80 C10 66 42 12 50 12 Z" fill={RICE} />
          <rect x="32" y="64" width="36" height="24" rx="4" fill="#3f5a3f" />
          <Face cx={50} cy={48} s={1} />
        </>
      )
    case 'bibim-noodle':
      return (
        <>
          <path d="M20 52 C24 36 76 36 80 52" fill="#f26b4a" />
          <path d="M30 46 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0" stroke="#fff3e0" strokeWidth={2.4} />
          <ellipse cx="62" cy="40" rx="9" ry="7" fill="#fff" />
          <circle cx="62" cy="40" r="3.6" fill={EGG} stroke="none" />
          <path d="M30 40 l8 -4 M36 42 l8 -4" stroke="#7cb26a" strokeWidth={4} />
          <Bowl band="#bcdcf5" />
          <Face cx={50} cy={74} s={0.9} />
        </>
      )
    case 'ramen':
      return (
        <>
          <path d="M28 30 q4 -8 0 -16 M50 28 q4 -8 0 -16 M72 30 q4 -8 0 -16" stroke="#c9b8a8" strokeWidth={2.4} />
          <path d="M18 52 C22 40 78 40 82 52" fill="#f2a65a" />
          <path d="M28 50 q5 -6 10 0 q5 -6 10 0 q5 -6 10 0 q5 -6 10 0" stroke={EGG} strokeWidth={3} />
          <path d="M70 18 L90 50 M78 14 L94 48" strokeWidth={3} stroke="#b07a4a" />
          <Bowl band="#ffb7c8" />
          <Face cx={50} cy={74} s={0.9} />
        </>
      )
    case 'fried-rice':
      return (
        <>
          <Plate />
          <path d="M18 70 C20 50 34 40 50 40 C66 40 80 50 82 70 C66 78 34 78 18 70 Z" fill="#f08a4b" />
          <circle cx="32" cy="62" r="2" fill="#7cb26a" stroke="none" /><circle cx="66" cy="66" r="2" fill="#7cb26a" stroke="none" />
          <path d="M34 42 C30 30 44 22 52 28 C62 20 74 30 66 42 C60 48 40 48 34 42 Z" fill="#fff" />
          <circle cx="50" cy="36" r="6.5" fill={EGG} />
          <Face cx={50} cy={60} s={0.75} />
        </>
      )
    case 'rice':
      return (
        <>
          <path d="M18 54 C18 30 82 30 82 54" fill={RICE} />
          <Bowl color="#d9ecfa" band="#fff" />
          <Face cx={50} cy={44} s={0.9} mouth="w" />
        </>
      )
    case 'curry':
      return (
        <>
          <Plate />
          <path d="M14 70 C16 56 34 48 50 48 V80 C30 80 16 76 14 70 Z" fill={RICE} />
          <path d="M50 48 C66 48 84 56 86 70 C84 76 70 80 50 80 Z" fill="#e0a43c" />
          <rect x="60" y="58" width="8" height="8" rx="2" fill="#f08a4b" />
          <rect x="72" y="64" width="7" height="7" rx="2" fill="#fff3c4" />
          <Face cx={32} cy={62} s={0.7} />
        </>
      )
    case 'sandwich':
      return (
        <>
          <path d="M12 76 L50 22 L88 76 Z" fill="#fffaf0" />
          <path d="M18 70 H82" stroke="#c98a4b" strokeWidth={8} />
          <path d="M16 74 H84" stroke="#a8d08d" strokeWidth={3} />
          <path d="M12 76 L50 22 L88 76 Z" />
          <Face cx={50} cy={52} s={0.9} />
        </>
      )
    case 'shrimp-rice':
      return (
        <>
          <Plate />
          <path d="M18 70 C20 50 34 42 50 42 C66 42 80 50 82 70 C66 78 34 78 18 70 Z" fill="#f4b183" />
          <path d="M56 40 C70 30 84 40 76 52 C72 58 62 56 62 50" fill="#ff8f6b" />
          <path d="M66 36 v6 M72 38 l-2 6" strokeWidth={2} />
          <Face cx={40} cy={60} s={0.75} />
        </>
      )
    case 'mentai-rice':
      return (
        <>
          <path d="M18 54 C18 30 82 30 82 54" fill={RICE} />
          <path d="M34 36 C40 28 58 28 64 36 C58 42 40 42 34 36 Z" fill="#ff9aa2" />
          <rect x="56" y="26" width="12" height="10" rx="2" fill="#fff3a8" />
          <Bowl color="#fff" band="#ffb7c8" />
          <Face cx={50} cy={72} s={0.9} />
        </>
      )
    case 'salad':
      return (
        <>
          <path d="M18 54 C14 36 30 30 36 38 C40 24 60 24 64 38 C72 30 88 38 82 54" fill={GREEN} />
          <circle cx="40" cy="44" r="6" fill="#e8553f" /><circle cx="62" cy="46" r="5" fill="#ffd96a" />
          <Bowl band="#bfe3c0" />
          <Face cx={50} cy={74} s={0.9} />
        </>
      )
    case 'cola':
      return <Bottle body="#8a4b32" label="#e8553f" />
    case 'cider':
      return <Bottle body="#bfe3c0" label="#fff" cap="#7cb26a" />
    case 'orange-soda':
      return <Bottle body="#ffb35c" label="#fff3c4" cap="#4a7ad8" />
    case 'can':
      return (
        <>
          <rect x="28" y="16" width="44" height="76" rx="8" fill="#ffe08a" />
          <path d="M28 26 H72 M28 82 H72" />
          <rect x="44" y="12" width="12" height="5" rx="2" fill="#ddd" />
          <Face cx={50} cy={52} s={1} />
        </>
      )
    case 'milktea':
      return (
        <>
          <path d="M60 22 L68 4" strokeWidth={4} stroke="#ff9eb5" />
          <path d="M26 24 H74 L68 90 C60 94 40 94 32 90 Z" fill="#e8c9a4" />
          <circle cx="40" cy="80" r="4" fill="#5b3a29" stroke="none" /><circle cx="52" cy="84" r="4" fill="#5b3a29" stroke="none" /><circle cx="61" cy="78" r="4" fill="#5b3a29" stroke="none" />
          <rect x="22" y="18" width="56" height="9" rx="4" fill="#fff" />
          <Face cx={50} cy={50} s={1} />
        </>
      )
    case 'yogurt':
      return (
        <>
          <path d="M28 30 L50 14 L72 30 V90 H28 Z" fill="#fff" />
          <rect x="28" y="44" width="44" height="26" fill="#ffd3e0" />
          <path d="M28 30 H72" />
          <Face cx={50} cy={55} s={1} />
        </>
      )
    case 'coffee':
      return (
        <>
          <path d="M40 20 q4 -6 0 -12 M54 20 q4 -6 0 -12" stroke="#c9b8a8" strokeWidth={2.4} />
          <path d="M22 30 H74 V62 C74 80 64 88 48 88 C32 88 22 80 22 62 Z" fill="#fff" />
          <path d="M74 40 C88 40 88 62 72 62" />
          <ellipse cx="48" cy="32" rx="24" ry="5" fill="#9c6b4a" />
          <Face cx={48} cy={58} s={1} />
        </>
      )
  }
}

function Sparkle({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return (
    <path
      d={`M${x} ${y - r} Q${x + r * 0.2} ${y - r * 0.2} ${x + r} ${y} Q${x + r * 0.2} ${y + r * 0.2} ${x} ${y + r} Q${x - r * 0.2} ${y + r * 0.2} ${x - r} ${y} Q${x - r * 0.2} ${y - r * 0.2} ${x} ${y - r} Z`}
      fill="#ffd84a" stroke="none"
    />
  )
}

/** 별이 반짝이는 큰 눈 */
function StarEye({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="7.5" ry="8.8" fill="#2b2422" stroke="none" />
      <Sparkle x={cx} y={cy + 1} r={4.6} />
      <circle cx={cx - 3} cy={cy - 4} r="1.5" fill="#fff" stroke="none" />
      <path d={`M${cx - 8} ${cy - 8} Q${cx} ${cy - 13} ${cx + 8} ${cy - 8}`} strokeWidth={2.6} />
      <path d={`M${cx + 7} ${cy - 9} l3 -2`} strokeWidth={2} />
    </g>
  )
}

/**
 * 주방장: 양갈래 단발 · 노란 X 머리핀 · 요리 모자, 거품기와 볼을 들고 "냠!" 웃는 아이.
 * 스티커처럼 하얀 테두리를 두른다. (참고 이미지 분위기로 새로 그린 그림)
 */
export function Chef({ size = 200, className }: { size?: number | string; className?: string }) {
  const BLACK = '#2b2422'
  const hairLine = '#5a4a44'
  const APRON = '#a9cdf0'
  return (
    <svg viewBox="0 0 200 240" width={size} height={size} className={className} role="img" aria-label="주방장">
      <Sparkle x={176} y={58} r={7} />
      <Sparkle x={182} y={150} r={5} />
      <Sparkle x={18} y={110} r={5} />
      <Svg size="100%" vb="0 0 200 240" sticker>
        {/* 양갈래 (머리 뒤) + 분홍 머리끈 */}
        <path d="M60 100 C40 96 28 114 34 130 C38 144 54 146 62 136 C56 126 56 112 64 106 Z" fill={BLACK} />
        <path d="M140 100 C160 96 172 114 166 130 C162 144 146 146 138 136 C144 126 144 112 136 106 Z" fill={BLACK} />
        <path d="M40 120 q4 8 12 10 M160 120 q-4 8 -12 10" stroke={hairLine} strokeWidth={1.8} />
        <ellipse cx="61" cy="108" rx="4" ry="5.5" fill="#ff8fab" />
        <ellipse cx="139" cy="108" rx="4" ry="5.5" fill="#ff8fab" />
        {/* 뒷머리 */}
        <path d="M58 106 C52 68 72 46 100 46 C128 46 148 68 142 106 C142 118 134 124 128 122 L72 122 C66 124 58 118 58 106 Z" fill={BLACK} />
        {/* 목 · 블라우스 · 퍼프 소매 */}
        <rect x="92" y="122" width="16" height="12" fill={SKIN} />
        <path d="M60 152 C66 136 82 130 100 130 C118 130 134 136 140 152 L148 240 H52 Z" fill="#fff" />
        <path d="M62 150 C46 148 38 166 44 178 C52 184 64 178 68 168 Z" fill="#fff" />
        <path d="M138 150 C154 148 162 166 156 178 C148 184 136 178 132 168 Z" fill="#fff" />
        {/* 하늘색 앞치마 + 어깨끈 */}
        <path d="M72 162 C72 152 80 148 86 148 L114 148 C120 148 128 152 128 162 L136 240 H64 Z" fill={APRON} />
        <path d="M78 150 L70 140 L76 137 L84 148 Z M122 150 L130 140 L124 137 L116 148 Z" fill={APRON} strokeWidth={2} />
        {/* 동그란 카라 */}
        <path d="M100 134 C92 130 82 134 84 144 C92 148 98 144 100 136 Z" fill="#fff" />
        <path d="M100 134 C108 130 118 134 116 144 C108 148 102 144 100 136 Z" fill="#fff" />
        <circle cx="100" cy="150" r="2" fill={INK} stroke="none" />
        {/* 얼굴 */}
        <ellipse cx="100" cy="94" rx="38" ry="35" fill={SKIN} />
        {/* 앞머리 · 옆머리 */}
        <path d="M62 94 C60 64 78 52 100 52 C122 52 140 64 138 94 C133 84 128 78 122 76 C122 86 116 92 108 92 C110 84 106 78 100 76 C96 84 88 90 79 90 C81 84 79 78 77 76 C71 80 66 86 62 94 Z" fill={BLACK} />
        <path d="M62 90 C55 102 57 116 64 122 C64 112 66 100 69 94 Z" fill={BLACK} />
        <path d="M138 90 C145 102 143 116 136 122 C136 112 134 100 131 94 Z" fill={BLACK} />
        <path d="M92 58 C90 64 91 70 93 74 M110 58 C112 63 112 68 111 72" stroke={hairLine} strokeWidth={1.6} />
        {/* 노란 X 머리핀 */}
        <path d="M70 64 L82 76 M82 64 L70 76" stroke="#ffd84a" strokeWidth={4.5} />
        {/* 살짝 기운 요리 모자 */}
        <g transform="rotate(-8 100 40)">
          <path d="M72 44 C58 42 58 22 74 20 C76 6 96 2 102 12 C110 2 130 6 130 20 C144 22 144 42 130 44 Z" fill="#fff" />
          <rect x="72" y="38" width="58" height="12" rx="4" fill="#fff" />
          <path d="M90 22 V36 M104 18 V36 M118 22 V36" strokeWidth={1.6} opacity={0.35} />
        </g>
        {/* 반짝이는 눈 · 웃는 입 · 빗금 볼터치 */}
        <StarEye cx={84} cy={100} />
        <StarEye cx={116} cy={100} />
        <path d="M91 113 Q100 125 109 113 Z" fill="#8a2f3b" strokeWidth={2.4} />
        <ellipse cx="100" cy="119" rx="4.2" ry="2.4" fill="#ff8fa3" stroke="none" />
        <ellipse cx="71" cy="111" rx="8" ry="5" fill="#ffadb9" stroke="none" opacity={0.75} filter="url(#blush)" />
        <ellipse cx="129" cy="111" rx="8" ry="5" fill="#ffadb9" stroke="none" opacity={0.75} filter="url(#blush)" />
        <path d="M66 112 l3 -4 M70 113 l3 -4 M74 114 l3 -4 M124 114 l3 -4 M128 113 l3 -4 M132 112 l3 -4" stroke="#e57a8a" strokeWidth={1.5} />
        {/* 번쩍 든 거품기 */}
        <path d="M40 196 L45 142" stroke="#9c6b4a" strokeWidth={7} />
        <path d="M45 142 C26 122 30 78 45 72 C60 78 64 122 45 142 Z M45 142 C37 122 39 86 45 80 C51 86 53 122 45 142 Z" stroke="#8e98a3" strokeWidth={2.4} />
        <circle cx="44" cy="166" r="10" fill={SKIN} />
        {/* 반죽이 든 볼을 꼭 안은 손 */}
        <path d="M62 198 H150 C150 222 132 236 106 236 C80 236 62 222 62 198 Z" fill="#d6dbe0" />
        <ellipse cx="106" cy="198" rx="44" ry="9" fill="#eef1f4" />
        <ellipse cx="106" cy="199" rx="35" ry="5.5" fill="#f6e2b3" stroke="none" />
        <path d="M72 210 Q78 224 92 230" stroke="#fff" strokeWidth={3} />
        <circle cx="150" cy="214" r="10" fill={SKIN} />
        <circle cx="70" cy="226" r="9" fill={SKIN} />
      </Svg>
    </svg>
  )
}

/** 할리갈리 같은 탁상 벨 */
export function Bell({ size = 40, className }: { size?: number | string; className?: string }) {
  return (
    <Svg size={size} className={className} title="벨">
      <path d="M22 70 C22 40 34 28 50 28 C66 28 78 40 78 70 Z" fill="#ffd96a" />
      <path d="M34 46 C36 38 42 34 48 34" stroke="#fff" strokeWidth={3} />
      <rect x="44" y="16" width="12" height="12" rx="4" fill="#e8553f" />
      <rect x="12" y="70" width="76" height="12" rx="5" fill="#ff9fb2" />
    </Svg>
  )
}

/** 메뉴판 · 연필 같은 작은 아이콘 */
export function Pencil({ size = 40 }: { size?: number | string }) {
  return (
    <Svg size={size} title="연필">
      <path d="M20 80 L28 58 L70 16 L84 30 L42 72 Z" fill="#ffd96a" />
      <path d="M70 16 L84 30 L90 24 C94 20 82 8 78 12 Z" fill="#ff9fb2" />
      <path d="M20 80 L28 58 L42 72 Z" fill="#ffe3cf" />
      <path d="M20 80 L24 70 L30 76 Z" fill={INK} />
    </Svg>
  )
}

/** 핀보드 장식: 바느질 단추 */
export function SewButton({ color, size = 26 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden>
      <g filter="url(#wobble)" stroke={INK} strokeWidth={2.2}>
        <circle cx="20" cy="20" r="16" fill={color} />
        <circle cx="20" cy="20" r="11" fill="none" opacity={0.35} />
        {[[16, 16], [24, 16], [16, 24], [24, 24]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" fill="#fff" />
        ))}
      </g>
    </svg>
  )
}

/** 핀보드 장식: 리본 */
export function Bow({ color = '#fff', size = 46 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (40 / 60)} aria-hidden>
      <g filter="url(#wobble)" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" fill={color}>
        <path d="M30 18 C20 4 4 6 6 18 C8 30 22 28 30 18 Z" />
        <path d="M30 18 C40 4 56 6 54 18 C52 30 38 28 30 18 Z" />
        <path d="M28 20 L20 38 L26 36 L30 22 Z M32 20 L40 38 L34 36 L30 22 Z" />
        <circle cx="30" cy="19" r="5" />
      </g>
    </svg>
  )
}
