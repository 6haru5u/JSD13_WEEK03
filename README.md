# 🎵 VIBE-CODE-MY-ECOMMERCE
> Concert Ticketing Web Application — สร้างด้วย MERN Stack (Vibe Coded by AI Agent)

---

## 📋 สรุปสิ่งที่ทำ (What Was Built)

โปรเจกต์นี้คือแอปพลิเคชัน **ระบบจองตั๋วคอนเสิร์ต** แบบ Full-Stack ที่สร้างขึ้นด้วยกระบวนการ **Vibe Coding** (ให้ AI เขียนโค้ดทั้งหมด) โดยใช้ MERN Stack พร้อม UI ดีไซน์แบบ Dark Glassmorphic

### ✅ ฟีเจอร์ที่สร้างเสร็จ

| ฟีเจอร์ | รายละเอียด |
|---|---|
| 🎟️ แสดงรายการคอนเสิร์ต | ดึงข้อมูลจาก API แสดงเป็น Card Grid พร้อมรูปภาพ ศิลปิน สถานที่ วันที่ |
| 🗺️ เลือกที่นั่ง | Seat Map แบบ Interactive แบ่ง Zone (VIP / Zone A / Zone B) คลิกเพื่อเลือก/ยกเลิก |
| 🛒 ตะกร้า (Cart Sidebar) | แสดงที่นั่งที่เลือก ราคารวม กด Checkout ได้ทันที |
| 💳 จ่ายเงิน / Checkout | เลือกวิธีชำระเงิน (Credit Card / QR PromptPay / Bank Transfer) แล้ว Confirm Booking |
| 📜 ประวัติการจอง | หน้า Orders แสดงรายการ Booking ทั้งหมด พร้อม Status และ Cancel ได้ |
| 🔐 Authentication | Register / Login ด้วย Email + Password เก็บ Session ใน localStorage |
| 🔍 ค้นหา | Search Bar กรองคอนเสิร์ตตาม ชื่อ / ศิลปิน / สถานที่ |
| 🌐 REST API | Express API ครบทุก Endpoint สำหรับ concerts, seats, auth, bookings |

### 🎨 ดีไซน์

- **Dark Mode** — พื้นหลังสีดำ/กรมท่า (`#0a0a0f`)
- **Glassmorphism** — การ์ดแบบโปร่งแสงพร้อม backdrop-filter blur
- **Gradient Accent** — ม่วง-ชมพู (`#8b5cf6` → `#ec4899`)
- **Micro-animations** — Hover effects, transitions, toast notifications
- **Font** — Outfit จาก Google Fonts

---

## 🏗️ โครงสร้างโปรเจกต์ (Project Structure)

```
VIBE-CODE-MY-ECOMMERCE/
├── README.md                   ← ไฟล์นี้
└── apps/
    ├── server/                 ← Backend (Node.js + Express)
    │   ├── server.js           ← Entry point, REST API routes
    │   ├── db.js               ← JSON File-based Database layer
    │   ├── package.json
    │   └── data/
    │       └── db.json         ← ฐานข้อมูล (JSON ไฟล์)
    │
    ├── client/                 ← Frontend (React + Vite)
    │   ├── index.html          ← HTML entry point
    │   ├── vite.config.js      ← Vite configuration
    │   ├── package.json
    │   └── src/
    │       ├── main.jsx        ← React entry point
    │       ├── App.jsx         ← Root component, state management
    │       ├── index.css       ← Design system & global styles
    │       ├── components/     ← Reusable UI Components
    │       │   ├── Navbar.jsx      ← Top navigation bar
    │       │   ├── Hero.jsx        ← Landing hero section
    │       │   ├── ProductCard.jsx ← Concert card component
    │       │   ├── SeatSelector.jsx← Interactive seat map
    │       │   └── Cart.jsx        ← Cart sidebar + Checkout
    │       └── pages/          ← Page-level components
    │           ├── Home.jsx        ← หน้าหลัก + Concert listing
    │           ├── Auth.jsx        ← Login / Register
    │           └── Orders.jsx      ← ประวัติ Booking
    │
    ├── api/                    ← (Empty — reserved)
    ├── web/                    ← (Empty — reserved)
    └── mobile/                 ← (Empty — reserved)
```

---

## 🌐 API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Auth | คำอธิบาย |
|---|---|---|---|
| `GET` | `/api/concerts` | ❌ | ดึงรายการคอนเสิร์ตทั้งหมด |
| `GET` | `/api/concerts/:id` | ❌ | ดึงข้อมูลคอนเสิร์ตเดียว |
| `GET` | `/api/concerts/:id/seats` | ❌ | ดึงแผนที่ที่นั่งของคอนเสิร์ต |
| `POST` | `/api/auth/register` | ❌ | สมัครสมาชิก |
| `POST` | `/api/auth/login` | ❌ | เข้าสู่ระบบ |
| `GET` | `/api/bookings` | ✅ | ดึงประวัติการจองของ user |
| `POST` | `/api/bookings` | ✅ | จองตั๋วคอนเสิร์ต |
| `POST` | `/api/bookings/:id/cancel` | ✅ | ยกเลิกการจอง |

> **Auth Header:** `x-user-id: <userId>` (ส่งใน request header)

---

## 🗄️ Database Schema (db.json)

ใช้ **JSON File** แทน MongoDB สำหรับ zero-config execution

```
db.json
├── users[]         — ข้อมูลผู้ใช้
├── artists[]       — ข้อมูลศิลปิน (3 วง)
├── venues[]        — สถานที่จัดงาน (2 แห่ง)
├── concerts[]      — รายการคอนเสิร์ต (6 รายการ)
├── seats[]         — ข้อมูลที่นั่งทุก Zone ของแต่ละคอนเสิร์ต
└── bookings[]      — ประวัติการจองตั๋ว
```

### ข้อมูลตัวอย่าง (Seed Data)

| ศิลปิน | แนวเพลง | สัญชาติ |
|---|---|---|
| Valkyrie Horizon | Synthwave / Cyberpunk | Sweden |
| Neo Tokyo Symphony | Orchestral Crossover | Japan |
| Cybernetic Oasis | Alternative Rock | United Kingdom |

### ราคาที่นั่ง

| Zone | ราคา |
|---|---|
| VIP | ฿3,000 |
| Zone A | ฿1,800 |
| Zone B | ฿900 |

---

## 🚀 วิธีรันโปรเจกต์

### Backend (Server)

```bash
cd apps/server
npm install       # ติดตั้ง dependencies (ครั้งแรก)
npm run dev       # รันด้วย nodemon (auto-reload)
# หรือ
npm start         # รันด้วย node ปกติ
```

Server จะรันที่ → `http://localhost:5000`

### Frontend (Client)

```bash
cd apps/client
npm install       # ติดตั้ง dependencies (ครั้งแรก)
npm run dev       # รัน Vite dev server
```

Client จะรันที่ → `http://localhost:5173`

> ⚠️ ต้องรัน **Server ก่อน** แล้วค่อยรัน Client

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี | เวอร์ชัน |
|---|---|---|
| Frontend | React | 18 |
| Build Tool | Vite | 5 |
| UI Icons | Lucide React | Latest |
| Backend | Node.js + Express | 4.x |
| Database | JSON File (db.js layer) | — |
| Dev Server | Nodemon | 3.x |
| Styling | Vanilla CSS + Glassmorphism | — |
| HTTP | Fetch API (native) | — |

---

## 👤 Test Account

หลังจากรัน server แล้ว สามารถสมัครสมาชิกใหม่ หรือใช้บัญชีทดสอบ:

| Field | Value |
|---|---|
| Email | charnonpkj@hotmail.com |
| Password | 123456 |

---

## 📝 หมายเหตุ

- โปรเจกต์นี้สร้างผ่านกระบวนการ **Vibe Coding** ด้วย Antigravity AI Agent
- ไม่ต้องติดตั้ง MongoDB — ข้อมูลเก็บในไฟล์ `data/db.json` ทันที
- ข้อมูล `db.json` จะอัปเดตจริงเมื่อมีการ Register / Book / Cancel
