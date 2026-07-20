<div align="center">

# ⚡ IP CODEMAKER AGENT (`ip_agent_001`)

### *The World's Most Advanced Autonomous AI Coding Suite & Multi-Model API Router*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-3.0-emerald.svg)
![WebGL](https://img.shields.io/badge/3D%20Canvas-WebGL-purple.svg)
![OpenAI API](https://img.shields.io/badge/OpenAI%20API-Compatible-green.svg)

---

### 🌐 [Live Web Dashboard: http://localhost:3006](http://localhost:3006) | 🔌 [Backend REST API: http://localhost:5000](http://localhost:5000)

</div>

---

## 🚀 Overview

**IP Codemaker Agent** is a next-generation autonomous AI developer workspace designed for high-performance software engineering, dynamic code synthesis, and multi-model agent orchestration.

Equipped with a **3D Neural Vortex Canvas HUD**, **Claude 3.5 Sonnet Reasoning Trace**, **Antigravity AI Multi-Agent Swarm**, **Desktop Drag-and-Drop Uploader**, and an **OpenAI-Compatible REST API**, IP Codemaker turns any developer prompt into production-ready software in seconds.

---

## 🔥 Key Flagship Features

```
               ┌─────────────────────────────────────────┐
               │    IP CODEMAKER CORE NEURAL ENGINE      │
               └────────────────────┬────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
  ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
  │ CHATGPT CORE │           │ ANTIGRAVITY  │           │  CLAUDE 3.5  │
  │ Conversational│           │ Multi-Agent  │           │ Reasoning &  │
  │   Synthesis  │           │   Artifacts  │           │ Computer Use │
  └──────────────┘           └──────────────┘           └──────────────┘
```

### 🧠 1. Claude 3.5 Sonnet & Computer Use Suite
- **Collapsible `<thinking>` Reasoning Trace**: View step-by-step cognitive analysis before code output.
- **Computer Use Action Badges**: Real-time visual telemetry for automated browser & CLI actions.
- **Project Knowledge Base Manager**: Store custom guidelines, coding conventions, and rules into a 200K Context Window.

### ⚡ 2. Antigravity AI Multi-Agent Swarm
- **Slash Commands Menu (`/`)**: `/goal`, `/plan`, `/audit`, `/schedule`, `/browser`, `/grill-me`, `/learn`, `/zip`.
- **Living Artifacts Drawer**: Track real-time `implementation_plan.md` and `task_checklist.md`.
- **Planning Mode Toggle**: Switch between multi-step architectural planning and direct execution.

### 📂 3. Desktop Drag-and-Drop & Workspace File Explorer
- **Desktop Drag-and-Drop Uploader**: Drag any file directly from your computer desktop onto the browser window.
- **1-Click File Saver**: Save generated code blocks straight onto your hard disk.
- **Live Workspace Explorer**: Inspect local project files directly from the sidebar drawer.

### 📦 4. Real-Time Live Workspace Exporter
- **1-Click Zip Downloader**: Package and export your current live codebase into a `.zip` archive in real time.
- Pre-packaged starter kits for **React 18 + Vite**, **FastAPI**, and **Jarvis Voice Assistant**.

### 🔌 5. OpenAI-Compatible REST API (`/v1/chat/completions`)
- Drop-in replacement for OpenAI API running on `http://localhost:5000/v1`.
- Seamlessly connects with **Cursor**, **VS Code Extensions**, **LangChain**, and external web apps.

---

## 💻 Installation & Setup

### Requirements
- **Node.js** v18.0 or higher
- **Python** v3.9 or higher

### Step 1: Clone Repository
```bash
git clone https://github.com/thoratpratik2323-hue/Project-Brain-v2.git
cd Project-Brain-v2
```

### Step 2: Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Install GUI Dependencies
```bash
cd gui
npm install
```

---

## 🎮 Launching the Application

#### Start Python Backend API (Terminal 1)
```bash
python server.py
# Server running at http://localhost:5000
```

#### Start Vite GUI Dashboard (Terminal 2)
```bash
cd gui
npm run dev
# Dashboard running at http://localhost:3006
```

Open **[http://localhost:3006](http://localhost:3006)** in your browser!

---

## 🛠️ API Usage Examples

### OpenAI-Compatible Endpoint (`/v1/chat/completions`)
```bash
curl -X POST http://localhost:5000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ip_agent_001",
    "messages": [
      {"role": "user", "content": "write a login component in react"}
    ]
  }'
```

### Direct Generative Synthesis (`/api/generate`)
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "python web scraper",
    "type": "code"
  }'
```

---

## 🌐 Production Deployment Guide

| Target | Platform | Command / Config |
| :--- | :--- | :--- |
| **Frontend GUI** | Vercel / Netlify | Build Command: `npm run build` | Output Dir: `gui/dist` |
| **Backend API** | Render / Railway / Fly.io | Command: `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Container** | Docker | `docker build -t ip-agent . && docker run -p 5000:5000 ip-agent` |

---

## 📜 License

Distributed under the **MIT License**. Free for personal and commercial open-source development.

---

<div align="center">
  <b>Built with ❤️ for IP Verse</b>
</div>
