# ⚽ Football Score — Real-time Scoreboard Overlay

[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-8.x-010101?logo=websocket&logoColor=white)](https://github.com/websockets/ws)
[![Node.js](https://img.shields.io/badge/Node.js-ES_Modules-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

> ป้ายคะแนนฟุตบอลแบบเรียลไทม์ สำหรับใช้เป็น Overlay ในการถ่ายทอดสด (Livestream) หรือจัดการแข่งขัน  
> พร้อมหน้าควบคุมคะแนนแยกต่างหากสำหรับผู้ดูแลระบบ

---

## 📖 Description

**Football Score** คือระบบ Scoreboard แบบเรียลไทม์ ที่ประกอบด้วย 2 ส่วนหลัก:

1. **Scoreboard Display** (`index.html`) — หน้าแสดงผลคะแนนแบบ Overlay พื้นหลังโปร่งใส เหมาะสำหรับใช้ใน OBS หรือซอฟต์แวร์ถ่ายทอดสด
2. **Config Panel** (`config-score.html`) — หน้าควบคุมสำหรับตั้งค่าชื่อทีมและคะแนน อัปเดตแบบเรียลไทม์ผ่าน WebSocket

ข้อมูลคะแนนถูก sync แบบเรียลไทม์ระหว่างทุก client ที่เชื่อมต่อ ผ่าน WebSocket Server ทำให้การเปลี่ยนแปลงจากหน้า Config จะสะท้อนไปยัง Scoreboard ทันที

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vite** | ^7.1.2 | Development server & build tool |
| **Express** | ^5.1.0 | HTTP server สำหรับ serve static files |
| **ws** | ^8.18.3 | WebSocket server สำหรับ real-time communication |
| **pnpm** | — | Package manager |
| **Node.js** | — | Runtime (ES Modules) |

### Frontend
- **HTML5** + **Vanilla CSS** + **Vanilla JavaScript**
- ฟอนต์ **Sarabun** จาก Google Fonts (รองรับภาษาไทย)

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Express Server                    │
│                   (port 3000)                       │
│                                                     │
│  ┌──────────────┐       ┌────────────────────────┐  │
│  │ Static Files │       │   WebSocket Server     │  │
│  │  (public/)   │       │                        │  │
│  └──────┬───────┘       └────────┬───────────────┘  │
│         │                        │                  │
└─────────┼────────────────────────┼──────────────────┘
          │                        │
          │              ┌─────────┴─────────┐
          │              │   Score Data       │
          │              │   (in-memory)      │
          │              └─────────┬─────────┘
          │                        │
    ┌─────┴──────┐          ┌──────┴──────┐
    │            │          │             │
    ▼            ▼          ▼             ▼
┌────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐
│Overlay │ │ Config   │ │Overlay │ │ Config   │
│Display │ │ Panel    │ │Display │ │ Panel    │
│Client  │ │ Client   │ │Client  │ │ Client   │
└────────┘ └──────────┘ └────────┘ └──────────┘
```

**การทำงาน:**
1. **Express** serve ไฟล์ static จาก `public/`
2. **WebSocket Server** จัดการ real-time communication
3. เมื่อ client ใหม่เชื่อมต่อ → ส่ง score data ปัจจุบันไปให้
4. เมื่อ Config Panel ส่งข้อมูลมา → broadcast ไปยังทุก client ที่เชื่อมต่ออยู่

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **pnpm** — Install: `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/Erbiyon/football-score.git
cd football-score

# Install dependencies
pnpm install
```

### Running the Server

```bash
# Start the Express + WebSocket server
node src/server.js
```

Server จะทำงานที่ `http://localhost:3000`

### Usage

| URL | Description |
|-----|-------------|
| `http://localhost:3000/` | 📺 Scoreboard Overlay (ใช้ใน OBS) |
| `http://localhost:3000/config-score.html` | ⚙️ Config Panel (ควบคุมคะแนน) |

### ใช้กับ OBS Studio

1. เปิด OBS Studio
2. เพิ่ม **Browser Source** ใหม่
3. ใส่ URL: `http://localhost:3000/`
4. ตั้งค่า Width / Height ตามต้องการ
5. เปิด Config Panel ในเบราว์เซอร์อีกแท็บเพื่อควบคุมคะแนน

---

## 📁 Project Structure

```
football-score/
├── public/                  # Static files (served by Express)
│   ├── index.html           # Scoreboard overlay display
│   └── config-score.html    # Admin config panel
├── src/
│   └── server.js            # Express + WebSocket server
├── package.json             # Dependencies & scripts
├── pnpm-lock.yaml           # Lock file
├── pnpm-workspace.yaml      # pnpm workspace config
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

---

## ✨ Key Features

- ⚡ **Real-time Updates** — คะแนนอัปเดตทันทีผ่าน WebSocket ไม่ต้อง refresh หน้า
- 🎨 **Transparent Overlay** — พื้นหลังโปร่งใส ใช้เป็น OBS Browser Source ได้เลย
- 🏠 **Home/Away Team** — รองรับตั้งชื่อทีมเจ้าบ้าน-ทีมเยือน พร้อมแยกสี (เขียว/แดง)
- 📱 **Config Panel** — หน้าควบคุมแยกต่างหาก จัดการง่าย
- 🔄 **Reset Function** — ปุ่มรีเซ็ตคะแนนและชื่อทีมในคลิกเดียว
- 🇹🇭 **Thai Language Support** — รองรับภาษาไทยด้วยฟอนต์ Sarabun
- 👥 **Multi-client Sync** — ทุก client ที่เชื่อมต่อจะได้รับข้อมูลเดียวกัน

---

## 🔧 Development Workflow

### Development Mode (Vite)

```bash
# Start Vite dev server (for frontend development)
pnpm dev
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Server Development

สำหรับการพัฒนา server (`src/server.js`) ให้รันด้วย Node โดยตรง:

```bash
node src/server.js
```

---

## 📐 Coding Standards

- **Module System:** ES Modules (`"type": "module"` in package.json)
- **Language:** HTML, CSS, JavaScript (Vanilla — no framework)
- **Font:** Sarabun (Google Fonts) สำหรับรองรับภาษาไทย
- **Styling:** Inline CSS ใน HTML files
- **WebSocket Protocol:** JSON-based message format

### Score Data Structure

```json
{
  "homeName": "ทีมเจ้าบ้าน",
  "awayName": "ทีมเยือน",
  "homeScore": 0,
  "awayScore": 0
}
```

---

## 🧪 Testing

### Manual Testing

1. เปิด server ด้วย `node src/server.js`
2. เปิด `http://localhost:3000/` ใน browser tab หนึ่ง
3. เปิด `http://localhost:3000/config-score.html` ใน browser tab อื่น
4. ลองเปลี่ยนชื่อทีม/คะแนน → ตรวจสอบว่า overlay อัปเดตทันที
5. ลองกดปุ่มรีเซ็ต → ตรวจสอบว่าค่าถูกล้าง

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Improvement Ideas

- [ ] เพิ่มระบบ Timer / นาฬิกานับเวลา
- [ ] เพิ่มโลโก้ทีม
- [ ] เพิ่ม Animation เมื่อคะแนนเปลี่ยน
- [ ] เพิ่มระบบ Authentication สำหรับ Config Panel
- [ ] รองรับ Theme / สีทีมที่ปรับแต่งได้
- [ ] Deploy ขึ้น cloud สำหรับใช้งานระยะไกล

---

## 📄 License

This project is open-source.

---

<p align="center">
  Made with ❤️ DekCom
</p>
