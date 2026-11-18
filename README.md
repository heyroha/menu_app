<div align="center">

# 🍳 오늘의 식탁

**둘이 쓰는 우리집 메뉴판 & 주방 주문서** — 한 사람이 메뉴판에서 먹고 싶은 걸 골라 "띵!" 벨을 누르면, 다른 사람의 주방 핀보드에 주문서가 바로 꽂히는 모바일 웹앱

<img src="https://img.shields.io/badge/React%2018-E5DBFF?style=flat-square&logo=react&logoColor=5F3DC4"/> <img src="https://img.shields.io/badge/TypeScript-E5DBFF?style=flat-square&logo=typescript&logoColor=5F3DC4"/> <img src="https://img.shields.io/badge/Vite-E5DBFF?style=flat-square&logo=vite&logoColor=5F3DC4"/> <img src="https://img.shields.io/badge/Supabase%20Realtime-E5DBFF?style=flat-square&logo=supabase&logoColor=5F3DC4"/> <img src="https://img.shields.io/badge/Vercel-E5DBFF?style=flat-square&logo=vercel&logoColor=5F3DC4"/>

<img src="docs/screenshots/02_home.jpg" width="240"/>&nbsp;&nbsp;<img src="docs/screenshots/03_menu.jpg" width="240"/>&nbsp;&nbsp;<img src="docs/screenshots/05_kitchen.jpg" width="240"/>

</div>

---

## 📌 한눈에 보기

| | |
|---|---|
| **무엇을** | "오늘 뭐 먹지?"를 식당 주문처럼 — 메뉴판에서 메모를 남겨 주문하면 주방에 주문서가 붙는다 |
| **어떻게** | 주문은 Supabase(PostgreSQL)에 저장하고 **Realtime** 구독으로 두 기기에 바로 반영, 메뉴판은 기기별 `localStorage` |
| **특징** | 색연필로 그린 듯한 주방장 · 음식 일러스트, 깅엄 천 · 레이스 핀보드, 할리갈리 같은 주문 벨 소리, 메뉴 BEST 표시, 터치 드래그로 순서 변경 |

---

## 📱 화면

### 1. 시작 · 홈

<table>
<tr>
<td align="center" width="50%"><img src="docs/screenshots/01_splash.jpg" width="250"/></td>
<td align="center" width="50%"><img src="docs/screenshots/02_home.jpg" width="250"/></td>
</tr>
<tr>
<td align="center"><sub><b>스플래시</b> — 거품기와 볼을 든 주방장 스티커, 2.8초 후(또는 탭하면) 홈으로</sub></td>
<td align="center"><sub><b>홈</b> — 창가 식탁 장면, 메뉴판 · 주방 · 메뉴 편집으로 이동</sub></td>
</tr>
</table>

### 2. 메뉴판 → 주문하기

<table>
<tr>
<td align="center" width="50%"><img src="docs/screenshots/03_menu.jpg" width="250"/></td>
<td align="center" width="50%"><img src="docs/screenshots/04_order_toast.jpg" width="250"/></td>
</tr>
<tr>
<td align="center"><sub>공책 줄 메뉴판. 메뉴마다 얼굴 있는 음식 그림이 붙고, <b>메모</b>("곱빼기!", "얼음 적게")를 적으면 그 줄이 색연필로 칠해짐</sub></td>
<td align="center"><sub><b>띵! 주문하기</b> → 탁상 벨 소리가 나고 벨이 흔들린 뒤, 주방장이 "주방에 쏙 들어갔어요" 알림</sub></td>
</tr>
</table>

### 3. 주방 — 핀보드 주문서

<table>
<tr>
<td align="center" width="50%"><img src="docs/screenshots/05_kitchen.jpg" width="250"/></td>
<td align="center" width="50%"><img src="docs/screenshots/06_note_detail.jpg" width="250"/></td>
</tr>
<tr>
<td align="center"><sub>나무 액자 · 핑크 깅엄 천 · 레이스 테두리 핀보드에 주문서가 <b>단추 · 리본 · 마스킹테이프</b>로 꽂힘. 종이 색과 각도가 조금씩 달라요. 주방을 보고 있을 때 새 주문이 오면 "띵띵!"</sub></td>
<td align="center"><sub>주문서를 누르면 리본 달린 큰 종이로 보기</sub></td>
</tr>
</table>

### 4. 메뉴 편집

<table>
<tr>
<td align="center" width="50%"><img src="docs/screenshots/07_edit.jpg" width="250"/></td>
<td width="50%">

- ⠿ 핸들을 **꾹 눌러 드래그**해서 순서 변경 (터치 이벤트로 직접 구현)
- ☆ / ★ 로 **BEST** 메뉴 지정
- ✕ 로 삭제, 하단 버튼으로 메뉴 추가 (이름 · 음식/음료 · 음식 그림 20종 중 선택)

</td>
</tr>
</table>

> 스크린샷은 실제 DB 대신 샘플 주문 데이터로 찍었습니다. 일러스트는 모두 직접 그린 SVG예요.
>
> 예전 이름(뭉뭉식탁)으로 저장된 기기의 메뉴판도 그대로 이어서 쓸 수 있도록 `localStorage` 키는 바꾸지 않았고, 이모지로 저장된 예전 메뉴 · 주문은 가장 비슷한 음식 그림으로 보여 줍니다.

---

## 🔄 동작 흐름

```
 [기기 A] 메뉴판 ──주문하기──▶ Supabase orders 테이블에 INSERT
                                     │
                                     │ postgres_changes (Realtime)
                                     ▼
 [기기 B] 주방 ◀── loadOrders() 다시 불러와 메모지 갱신 (polling 없음)
```

| 데이터 | 저장 위치 | 이유 |
|---|---|---|
| 주문 (`orders`) | Supabase PostgreSQL | 두 기기가 함께 봐야 함 → Realtime 구독 |
| 메뉴판 · 메모 입력 중 상태 | 기기별 `localStorage` | 서버 왕복 없이 바로 편집, 새로고침해도 유지 |

- 주문 번호는 `orders` 행 개수 + 1 로 매긴다.
- 주문서에는 그 시점의 메뉴 전체를 담고, 주방에서는 메모가 있는 메뉴만 보여 준다. 그래서 나중에 메뉴를 바꿔도 지난 주문서 내용은 그대로다.

---

## 🛠 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | React 18 (`useState` · `useEffect`), TypeScript, Vite |
| 그림 | 직접 그린 인라인 SVG (주방장 · 음식 20종 · 벨 · 단추 · 리본), SVG `feTurbulence` 필터로 색연필 질감, `feMorphology` 로 스티커 테두리 |
| 스타일 | Gaegu 손글씨체, 비스듬한 줄무늬로 칠한 색연필 면, CSS 깅엄 · `border-image` 레이스 |
| 소리 | Web Audio API 로 탁상 벨 합성 (음원 파일 없음) |
| Backend | Supabase — PostgreSQL + Realtime `postgres_changes` |
| 배포 | Vercel |

---

## 🗄 데이터베이스 스키마

```sql
create table orders (
  id           text primary key,
  order_number integer,
  items        jsonb not null,        -- 주문 당시 메뉴 + 메모
  created_at   timestamptz not null,
  rotation     float not null         -- 메모지 기울기 (-3° ~ 3°)
);
```

Realtime 을 쓰려면 Supabase 대시보드에서 `orders` 테이블의 Realtime 을 켜야 한다.

---

## 📂 프로젝트 구조

```
src/
├── App.tsx              # 화면 전환 (home | menu | kitchen | edit) + Realtime 구독 · 새 주문 벨
├── components/
│   ├── Art.tsx          # 색연필 일러스트: 주방장 · 음식 20종 · 벨 · 단추 · 리본
│   ├── SplashScreen.tsx # 시작 화면
│   ├── HomeScreen.tsx   # 홈 (창가 식탁 장면)
│   ├── MenuTab.tsx      # 메뉴판 · 메모 · 띵! 주문하기
│   ├── KitchenTab.tsx   # 핀보드 주문서 · 크게 보기 · 페이지
│   └── EditTab.tsx      # 메뉴 추가·삭제·BEST·드래그 정렬 · 그림 고르기
├── sound.ts             # 주문 벨 소리 (Web Audio)
├── storage.ts           # 기본 메뉴, localStorage, Supabase 조회·저장
├── supabase.ts          # Supabase 클라이언트
├── types.ts             # MenuItem, Order
└── app.css              # 하얀 종이 · 색연필 테마
index.html               # Gaegu 폰트 · #crayon / #wobble SVG 필터
```

---

## 🚀 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

Vercel 배포: `vercel --prod`
