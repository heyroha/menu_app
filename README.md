# 🐶 뭉뭉식탁

> 커플을 위한 귀여운 메뉴 주문 웹앱 — 오늘 뭐 먹을지 고민 끝!

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-realtime-3ECF8E?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel)

---

## 📱 소개

**뭉뭉식탁**은 커플이 서로 오늘 먹고 싶은 메뉴를 고르고, 실시간으로 주방에 주문이 접수되는 웹앱입니다.  
메뉴판에서 원하는 음식에 메모를 남기면 상대방의 주방에 귀여운 메모지 형태로 즉시 표시됩니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🍽️ **메뉴판** | 음식·음료 카테고리별 메뉴 목록, 항목마다 메모 입력 |
| 👨‍🍳 **주방** | 접수된 주문이 코르크보드 메모지 스타일로 표시, 클릭 시 확대 보기 |
| ✏️ **메뉴 편집** | 메뉴 추가·삭제, BEST 설정, 꾹 눌러 드래그로 순서 변경 |
| 🔄 **실시간 동기화** | Supabase Realtime으로 두 기기 간 주문 즉시 반영 |
| 🏠 **홈 화면** | 각 탭으로 이동하는 랜딩 페이지 |

---

## 🛠 기술 스택

### Frontend
- **React 18** + **TypeScript** — 컴포넌트 기반 UI
- **Vite** — 빠른 번들링 및 개발 서버
- **CSS Variables** — 디자인 토큰 기반 스타일링 (코르크보드, 메모지 UI)

### Backend & 인프라
- **Supabase** — PostgreSQL DB + Realtime 구독으로 실시간 동기화
- **Vercel** — 프론트엔드 배포 및 자동 HTTPS

### 상태 관리
- React `useState` / `useEffect` — 로컬 상태
- Supabase `postgres_changes` 구독 — 서버 상태 실시간 반영
- `localStorage` — 메뉴 데이터 로컬 저장

---

## 📂 프로젝트 구조

```
src/
├── components/
│   ├── SplashScreen.tsx   # 앱 시작 스플래시
│   ├── HomeScreen.tsx     # 홈 랜딩 페이지
│   ├── MenuTab.tsx        # 메뉴판 + 주문하기
│   ├── KitchenTab.tsx     # 주방 (코르크보드 + 메모 확대)
│   └── EditTab.tsx        # 메뉴 편집 + 드래그 순서 변경
├── supabase.ts            # Supabase 클라이언트
├── storage.ts             # DB 연동 함수 (loadOrders, saveOrder 등)
├── types.ts               # MenuItem, Order 타입 정의
├── App.tsx                # 라우팅 (home | menu | kitchen | edit)
└── app.css                # 전체 스타일
```

---

## 🗄 데이터베이스 스키마

```sql
create table orders (
  id           text primary key,
  order_number integer,
  items        jsonb not null,
  created_at   timestamptz not null,
  rotation     float not null
);
```

---

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

---

## 🌐 배포

[Vercel](https://vercel.com)을 통해 배포합니다.

```bash
vercel --prod
```

---

## 📸 화면 구성

```
홈 화면
 ├── 메뉴판 → 메뉴 선택 + 메모 입력 → 주문하기
 ├── 주방  → 접수된 주문 메모지 목록 → 클릭 시 상세 보기
 └── 메뉴 편집 → 메뉴 추가 / 삭제 / 순서 변경
```

---

## 💡 개발 포인트

- **Supabase Realtime** `postgres_changes` 이벤트를 구독해 별도 polling 없이 실시간 동기화 구현
- 메모지 UI는 CSS `transform: rotate()` + 코르크 도트 패턴으로 아날로그 감성 표현
- 모바일 터치 드래그(`onTouchStart` / `onTouchMove` / `onTouchEnd`)로 네이티브 라이브러리 없이 순서 변경 구현
- `localStorage`와 Supabase를 혼합해 메뉴(로컬)와 주문(서버) 데이터를 분리 관리
