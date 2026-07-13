# 🤖 CONTEXT.md — AI Agent Handoff Document
> อ่านไฟล์นี้ก่อนทำงานต่อทุกครั้ง เพื่อเข้าใจ context ของโปรเจกต์ได้ทันที

---

## 🎯 โปรเจกต์นี้คืออะไร

**AURA Command Ticketing** — ระบบจองตั๋วคอนเสิร์ตออนไลน์ แบบ Full-Stack
สร้างด้วยกระบวนการ **Vibe Coding** ผ่าน Antigravity AI Agent (Gemini/Claude)
ส่วนหนึ่งของคอร์ส **JSD13 / Week 03**

---

## 📍 Path สำคัญ

| ส่วน | Path |
|---|---|
| Root โปรเจกต์ | `C:\Users\charn\coding\jsd13\week03\VIBE-CODE-MY-ECOMMERCE\` |
| Backend (server) | `apps\server\` |
| Frontend (client) | `apps\client\` |
| ฐานข้อมูล | `apps\server\data\db.json` |
| Design System CSS | `apps\client\src\index.css` |
| State Manager | `apps\client\src\App.jsx` |
| Components | `apps\client\src\components\` |
| Pages | `apps\client\src\pages\` |

---

## ▶️ วิธีรันโปรเจกต์ (ต้องรันทั้งสอง Terminal)

```powershell
# Terminal 1 — Backend
cd C:\Users\charn\coding\jsd13\week03\VIBE-CODE-MY-ECOMMERCE\apps\server
npm run dev
# → รันที่ http://localhost:5000

# Terminal 2 — Frontend
cd C:\Users\charn\coding\jsd13\week03\VIBE-CODE-MY-ECOMMERCE\apps\client
npm run dev
# → รันที่ http://localhost:5173
```

---

## 🏛️ Architecture Overview

```
Browser (React SPA)
        ↕ fetch() HTTP
Express API (port 5000)
        ↕ read/write
db.json (JSON flat-file ใช้แทน MongoDB)
```

### Authentication Pattern
- ไม่มี JWT — ใช้ `x-user-id` header แทน
- Frontend เก็บ user object ใน `localStorage` key: `aura_user`
- Backend verify ด้วย `requireAuth` middleware ที่ค้น `db.users` จาก `x-user-id`

### State Management (App.jsx)
```
App.jsx  ← root state manager (no Redux, no Context API)
  ├── activePage       — 'home' | 'auth' | 'orders'
  ├── products         — concerts array จาก API
  ├── cartItems        — selected seats array
  ├── currentConcert   — concert ที่กำลัง book
  ├── currentUser      — { id, name, email, phone }
  └── toast            — { message, type } notification
```

---

## 🗂️ ไฟล์ทั้งหมดและหน้าที่

### Backend (`apps/server/`)

| ไฟล์ | หน้าที่ |
|---|---|
| `server.js` | Express app, route definitions ทั้งหมด |
| `db.js` | JSON file I/O layer — เลียนแบบ MongoDB collections |
| `data/db.json` | ฐานข้อมูลจริง (อ่านเขียนได้ live) |
| `package.json` | deps: express, cors, dotenv / devDep: nodemon |

#### db.js Collections API
```js
db.users.find()               // array ทั้งหมด
db.users.findOne({ email })   // หา 1 รายการ
db.users.create({ ...data })  // สร้างใหม่ + auto id/timestamp

db.concerts.find()
db.concerts.findById(id)

db.seats.findByConcert(concertId)

db.bookings.findByUser(userId)
db.bookings.create(userId, concertId, seats, totalPrice, paymentMethod)
db.bookings.cancel(bookingId)  // คืน seat status → 'Available'
```

### Frontend (`apps/client/src/`)

| ไฟล์/โฟลเดอร์ | หน้าที่ |
|---|---|
| `main.jsx` | React entry point |
| `App.jsx` | Root component, state, routing, API calls |
| `index.css` | Design system: CSS variables, glassmorphism, animations |
| `components/Navbar.jsx` | Top nav: logo, search, cart badge, user avatar, logout |
| `components/Hero.jsx` | Landing hero section, CTA button |
| `components/ProductCard.jsx` | Concert card: รูป, ชื่อ, วันที่, ราคา, ปุ่ม Book |
| `components/SeatSelector.jsx` | Interactive seat map modal |
| `components/Cart.jsx` | Sidebar drawer: seat list, total, checkout form |
| `pages/Home.jsx` | Concert grid + search filter + SeatSelector trigger |
| `pages/Auth.jsx` | Login / Register form (toggle) |
| `pages/Orders.jsx` | Booking history + cancel button |

---

## 🌐 API Reference

Base: `http://localhost:5000`

| Method | Path | Auth | Body / Params |
|---|---|---|---|
| GET | `/api/concerts` | ❌ | — |
| GET | `/api/concerts/:id` | ❌ | — |
| GET | `/api/concerts/:id/seats` | ❌ | — |
| POST | `/api/auth/register` | ❌ | `{ firstName, lastName, email, phone, password }` |
| POST | `/api/auth/login` | ❌ | `{ email, password }` |
| GET | `/api/bookings` | ✅ header: `x-user-id` | — |
| POST | `/api/bookings` | ✅ header: `x-user-id` | `{ concertId, selectedSeats[], paymentMethod }` |
| POST | `/api/bookings/:id/cancel` | ✅ header: `x-user-id` | — |

---

## 🗄️ db.json Schema

```jsonc
{
  "users": [
    { "id", "firstName", "lastName", "email", "phone", "password", "createdAt" }
  ],
  "artists": [
    { "id", "name", "genre", "country", "image" }
  ],
  "venues": [
    { "id", "venue_name", "address", "capacity" }
  ],
  "concerts": [
    { "id", "artist_id", "venue_id", "title", "concert_date", "start_time", "end_time", "image" }
  ],
  "seats": [
    { "id", "concert_id", "venue_id", "zone", "seat_number", "price", "status" }
    // status: "Available" | "Booked"
  ],
  "bookings": [
    { "id", "user_id", "concert_id", "seats[]", "totalPrice", "paymentMethod", "status", "createdAt" }
    // status: "Confirmed" | "Cancelled"
  ]
}
```

### Seed Data ที่มีอยู่
- **Artists:** Valkyrie Horizon, Neo Tokyo Symphony, Cybernetic Oasis
- **Venues:** Quantum Dome Arena, Aether Amphitheatre
- **Concerts:** 6 รายการ (con-1 ถึง con-6)
- **Seats:** ~30 ที่นั่งต่อคอนเสิร์ต แบ่ง VIP(฿3000) / Zone A(฿1800) / Zone B(฿900)

---

## 🎨 Design System

ใช้ CSS Variables ใน `index.css`:

```css
--bg-primary: #0a0a0f        /* พื้นหลังหลัก */
--bg-secondary: #12121e
--accent-primary: #8b5cf6    /* ม่วง */
--accent-secondary: #ec4899  /* ชมพู */
--accent-success: #10b981    /* เขียว */
--accent-error: #ef4444      /* แดง */
--text-primary: #f8fafc
--text-secondary: #94a3b8
--text-muted: #64748b
```

CSS Classes พิเศษ:
- `.glass-panel` — glassmorphism card
- `.btn-primary` — gradient violet-pink button
- `.btn-secondary` — outline button
- `.badge` / `.badge-vip` — zone badges

---

## 🐛 ปัญหาที่รู้อยู่แล้ว / Known Issues

| ปัญหา | รายละเอียด | สถานะ |
|---|---|---|
| ไม่มี payment gateway จริง | Checkout บันทึก paymentMethod เป็น string เท่านั้น | ยังไม่แก้ |
| Password ไม่ถูก hash | เก็บ plain text ใน db.json | ยังไม่แก้ |
| ไม่มี rate limiting | API ไม่มีการป้องกัน spam | ยังไม่แก้ |
| ที่นั่ง seat ยึดไว้ชั่วคราวไม่ได้ | ถ้าสองคน select seat เดียวกันพร้อมกัน อาจชนกัน | ยังไม่แก้ |

---

## 💡 Feature Ideas / สิ่งที่ยังสามารถทำต่อได้

- [ ] เพิ่มศิลปินและคอนเสิร์ตใหม่ใน `db.json`
- [ ] ทำ Payment page แยกออกมาพร้อม form Credit Card / QR Code
- [ ] เพิ่ม Admin Panel สำหรับจัดการคอนเสิร์ต
- [ ] เพิ่ม e-Ticket PDF download หลัง booking
- [ ] เพิ่ม filter/sort: ตาม artist, venue, date, price
- [ ] เปลี่ยน db.json เป็น MongoDB จริง (mongoose)
- [ ] เพิ่ม bcrypt hash password
- [ ] เพิ่ม JWT authentication
- [ ] ทำ mobile responsive ให้ดีขึ้น
- [ ] Deploy: frontend → Vercel, backend → Railway/Render

---

## 👤 ข้อมูล User ทดสอบ

| Field | Value |
|---|---|
| Email | charnonpkj@hotmail.com |
| Password | 123456 |
| userId | user-1783932549405 |

---

## 📝 History / สิ่งที่เคยทำมาแล้ว

1. สร้าง MERN Stack Concert Ticketing App ทั้งหมดด้วย Vibe Coding
2. ย้ายโปรเจกต์จาก `C:\Users\charn\.gemini\antigravity\scratch\mern-ecommerce` มาที่โฟลเดอร์ปัจจุบัน
3. สร้าง `README.md` สรุปโปรเจกต์
4. สร้าง `CONTEXT.md` ไฟล์นี้

---

> **สำหรับ AI Agent:** เมื่อได้รับงานต่อ ให้อ่านไฟล์นี้ก่อน แล้วทำการ `list_dir` และ `view_file` ไฟล์ที่เกี่ยวข้องเพื่อเข้าใจ current state ก่อนแก้ไขโค้ดใดๆ
