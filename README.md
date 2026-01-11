# Novav3 - Professional AI Workflow Builder

Novav3 is a powerful, professional-grade visual node editor for building complex AI-driven content generation pipelines. Inspired by the best in class (TapNow, Pikaso, Pletor), it enables seamless collaboration between text, image, and video models.

![Novav3](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple) ![AI](https://img.shields.io/badge/AI-Integrated-green)

## ✨ Key Features

- 🎨 **Pro Visual Canvas** - High-performance React Flow editor with customized dark-glass aesthetic.
- 🚀 **10+ Smart Node Types** - Text, Image (Flux/SDXL), Video (Sora 2/Kling), Master Prompt, Camera Control, and more.
- ⚡ **Cascade Execution** - Run entire workflows with one click; nodes automatically wait for their parents.
- 📱 **iPad Pro Optimized** - Full support for touch gestures and Apple Pencil 1 & 2.
- 🎭 **Responsive Landing Page** - Beautifully designed product showcase with an interactive hero demo.
- 💾 **State Persistence** - Automatic auto-save and workflow export/import (JSON).
- 🔓 **Multi-API Integration** - Native support for Kie.ai and OpenAI with easy key management.

## 🛠️ Tech Stack

- **React 18 / TypeScript / Vite 6**
- **@xyflow/react** (React Flow)
- **Zustand** (Global Store with Middleware)
- **Framer Motion** (Pro-grade Animations)
- **Tailwind CSS** (Custom Dark Theme)
- **Lucide React** (Interface Icons)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup API keys (see AI_SETUP.md)
cp .env.example .env

# Start dev server
npm run dev

# Build for production
npm run build
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete` / `Backspace` | Delete selected nodes |
| `⌘/Ctrl + S` | Save current workflow |
| `⌘/Ctrl + A` | Select all nodes |
| `⌘/Ctrl + K` | Open Command Palette (Coming Soon) |
| `Shift + Click` | Multi-select nodes |
| `Double Click (Pane)` | Open Node Library |

## 📁 Project Structure

```
src/
├── components/
│   ├── nodes/           # Custom React Flow Node types
│   ├── LandingPage.tsx   # Product landing page
│   ├── HeroCanvas.tsx    # Landing page interactive demo
│   ├── Sidebar.tsx       # Main navigation
│   └── TopBar.tsx        # Project & API settings
├── lib/
│   └── api.ts            # SDK for Kie.ai & OpenAI
├── store/
│   └── useStore.ts       # Central engine (Cascade logic)
└── index.css             # Global design tokens
```

## 📝 Setup & Configuration

Please refer to [AI_SETUP.md](AI_SETUP.md) for detailed instructions on configuring API keys for **OpenAI** and **Kie.ai**.

## 📄 License
MIT License

---
**Advanced Agentic Coding** 🤖
