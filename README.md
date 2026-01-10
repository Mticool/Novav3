# TapNow Clone - Visual Node Editor

A beautiful visual node editor for AI content generation, inspired by [TapNow](https://app.tapnow.ai).

![TapNow Clone](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple)

## ✨ Features

- 🎨 **Visual Node Editor** - Drag-and-drop canvas with React Flow
- 🎯 **3 Node Types** - Text, Image, and Video nodes
- 🔗 **Node Connections** - Connect nodes with smooth bezier curves
- 💾 **Auto-Save** - Automatic localStorage persistence
- ⌨️ **Keyboard Shortcuts** - Full keyboard support
- 🎭 **Beautiful UI** - Dark theme with glassmorphism effects
- 🚀 **State Management** - Zustand for reactive updates

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Lightning fast build tool
- **@xyflow/react** - Powerful node-based UI
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete` / `Backspace` | Delete selected nodes |
| `⌘/Ctrl + S` | Save workflow |
| `⌘/Ctrl + A` | Select all nodes |
| `⌘/Ctrl + Z` | Undo (coming soon) |
| `⌘/Ctrl + Shift + Z` | Redo (coming soon) |
| `Shift + Click` | Multi-select nodes |

## 🎨 Node Types

### 📝 Text Node (Green)
- Editable title
- Textarea for prompts
- Character counter
- Perfect for AI text generation prompts

### 🖼️ Image Node (Blue)
- Upload placeholder with drag & drop
- Image preview
- Download button
- Designed for image generation

### 🎥 Video Node (Purple)
- Video placeholder
- Video preview with controls
- Ideal for video generation workflows

## 🎯 Features in Detail

### Canvas Controls
- **Pan** - Click and drag on empty space
- **Zoom** - Scroll wheel or pinch
- **Fit View** - Automatically fits all nodes
- **Selection** - Click nodes or drag to select multiple

### Node Interactions
- **Drag & Drop** - Move nodes freely
- **Connect** - Drag from right handle to left handle
- **Edit** - Click to edit node titles and content
- **Delete** - Select and press Delete key

### UI Components
- **Sidebar** - Add Nodes menu with icons
- **TopBar** - Project name, credits, share options
- **Hints Panel** - Quick keyboard shortcuts reference
- **Empty State** - Helpful onboarding when canvas is empty

## 📁 Project Structure

```
src/
├── components/
│   ├── nodes/
│   │   ├── ImageNode.tsx    # Image node component
│   │   ├── TextNode.tsx     # Text node component
│   │   └── VideoNode.tsx    # Video node component
│   ├── AddNodesMenu.tsx     # Node type selector
│   ├── Sidebar.tsx          # Left sidebar navigation
│   └── TopBar.tsx           # Header with project info
├── hooks/
│   └── useKeyboardShortcuts.ts  # Keyboard event handlers
├── store/
│   └── useStore.ts          # Zustand store with persistence
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
└── index.css                # Global styles + React Flow customization
```

## 🎨 Design System

### Colors
- `--canvas-bg`: #0a0a0a (Deep black)
- `--node-bg`: rgba(26, 26, 26, 0.95) (Dark glass)
- `--accent-blue`: #4a9eff (Primary blue)
- `--node-border`: rgba(255, 255, 255, 0.05) (Subtle border)

### Typography
- **Font**: Inter (13px base, 14px titles)
- **Weight**: 400 (regular), 600 (semibold)

### Spacing
- **Node padding**: 12px
- **Border radius**: 16px (nodes), 8px (small elements)
- **Sidebar width**: 56px
- **TopBar height**: 56px

## 🔮 Coming Soon

- [ ] Undo/Redo history
- [ ] Copy/Paste nodes
- [ ] Node templates
- [ ] Export/Import workflows
- [ ] Real-time collaboration
- [ ] AI integration
- [ ] More node types
- [ ] Custom themes

## 📝 Development

### Adding a New Node Type

1. Create node component in `src/components/nodes/`
2. Register in `nodeTypes` object in `App.tsx`
3. Add to `AddNodesMenu.tsx` items list
4. Update store type in `useStore.ts`

### Customizing Styles

All visual customization is in:
- `tailwind.config.js` - Colors, animations
- `src/index.css` - React Flow specific styles
- Component files - Tailwind utility classes

## 🙏 Credits

Inspired by [TapNow](https://app.tapnow.ai) - An amazing visual AI workflow builder.

Built with ❤️ using React Flow and Zustand.

## 📄 License

MIT License - feel free to use this project for learning and inspiration!

---

**Built with Cursor AI** 🤖

