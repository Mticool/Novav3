import { ReactFlow, Background, MiniMap, ReactFlowProvider, ConnectionLineType, Connection, ReactFlowInstance, OnConnectStartParams } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useEffect } from 'react';
import { CanvasEmptyState } from './components/CanvasEmptyState';
import { LandingPage } from './components/LandingPage';

import { ImageNode } from './components/nodes/ImageNode';
import { TextNode } from './components/nodes/TextNode';
import { VideoNode } from './components/nodes/VideoNode';
import { MasterPromptNode } from './components/nodes/MasterPromptNode';
import { ModifierNode } from './components/nodes/ModifierNode';
import { GeneratorNode } from './components/nodes/GeneratorNode';
import { CameraNode } from './components/nodes/CameraNode';
import { ImageUploadNode } from './components/nodes/ImageUploadNode';
import { ArraySplitterNode } from './components/nodes/ArraySplitterNode';
import { CommentNode } from './components/nodes/CommentNode';
import { ConnectSuggestMenu } from './components/ConnectSuggestMenu';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ApiKeyPrompt } from './components/ApiKeyPrompt';
import { BottomControls } from './components/BottomControls';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import { LibraryPanel } from './components/LibraryPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { OnboardingTour } from './components/OnboardingTour';
import { useStore } from './store/useStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import { hasApiKeys, updateApiKeys } from './lib/api';

type NodeType = 'text' | 'image' | 'video' | 'masterPrompt' | 'modifier' | 'generator' | 'camera' | 'imageUpload' | 'arraySplitter' | 'comment';

const nodeTypes = {
  image: ImageNode,
  text: TextNode,
  video: VideoNode,
  masterPrompt: MasterPromptNode,
  modifier: ModifierNode,
  generator: GeneratorNode,
  camera: CameraNode,
  imageUpload: ImageUploadNode,
  arraySplitter: ArraySplitterNode,
  comment: CommentNode,
};

function App() {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const addNodeAt = useStore((state) => state.addNodeAt);
  const view = useStore((state) => state.view);

  const [rf, setRf] = useState<ReactFlowInstance | null>(null);
  const [connectStart, setConnectStart] = useState<{
    nodeId: string;
    handleId?: string | null;
    handleType?: 'source' | 'target' | null;
  } | null>(null);
  const [suggestMenu, setSuggestMenu] = useState<{
    x: number;
    y: number;
    sourceNodeId: string;
    sourceHandleId?: string | null;
  } | null>(null);

  // Panels state
  const [showLibrary, setShowLibrary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Check for API keys
  const [showApiPrompt, setShowApiPrompt] = useState(false);

  useEffect(() => {
    const keys = hasApiKeys();
    if (!keys.hasKie) {
      setShowApiPrompt(true);
    }
  }, []);

  const handlePaneClick = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      // Double click to open library
      setShowLibrary(true);
    }
  };

  const handleSaveKeys = (openaiKey: string, kieKey: string) => {
    updateApiKeys(openaiKey, kieKey);
    setShowApiPrompt(false);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts();

  // Auto-save
  useAutoSave(true);

  if (view === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className="h-screen w-screen bg-canvas-bg flex">
      {/* Onboarding */}
      <OnboardingTour />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Panels */}
      {showLibrary && <LibraryPanel onClose={() => setShowLibrary(false)} />}
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}

      {/* API Key Prompt */}
      {showApiPrompt && <ApiKeyPrompt onSave={handleSaveKeys} />}

      {/* Sidebar */}
      <Sidebar
        onOpenLibrary={() => setShowLibrary(true)}
        onOpenHistory={() => setShowHistory(true)}
      />

      {/* Main area */}
      <div className="flex-1 relative">
        {/* Pikaso-style vignette */}
        <div className="pointer-events-none absolute inset-0 z-0 pika-vignette" />
        {/* TopBar */}
        <TopBar />

        {/* Canvas */}
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={(c: Connection) => {
              setSuggestMenu(null);
              setConnectStart(null);
              onConnect(c);
            }}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.Bezier}
            defaultEdgeOptions={{
              // default edge type (bezier). Intentionally omit `type`.
              animated: false,
              style: {
                strokeWidth: 2,
                stroke: '#64748b',
              },
              interactionWidth: 20,
              className: 'edge-hoverable',
            }}
            onInit={(instance) => setRf(instance)}
            onConnectStart={(_, params: OnConnectStartParams) => {
              // params: { nodeId, handleId, handleType }
              if (params.nodeId) {
                setConnectStart({
                  nodeId: params.nodeId,
                  handleId: params.handleId,
                  handleType: params.handleType,
                });
              }
            }}
            onConnectEnd={(event) => {
              // if dropped on pane -> open suggest menu at cursor
              const target = event.target as HTMLElement | null;
              const droppedOnPane = !!target?.classList?.contains('react-flow__pane');
              if (!droppedOnPane) return;
              if (!connectStart?.nodeId) return;
              setSuggestMenu({
                x: (event as MouseEvent).clientX,
                y: (event as MouseEvent).clientY,
                sourceNodeId: connectStart.nodeId,
                sourceHandleId: connectStart.handleId,
              });
            }}
            fitView
            className="bg-canvas-bg"
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Shift"
            snapToGrid={true}
            snapGrid={[20, 20]}
            nodesDraggable={true}
            nodeDragThreshold={2}
            onPaneClick={handlePaneClick}
          >
            <Background
              gap={24}
              size={1.5}
              color="rgba(255, 255, 255, 0.05)"
            />
            <BottomControls />
            <MiniMap
              nodeColor={(node) => {
                switch (node.type) {
                  case 'image': return '#3b82f6';
                  case 'video': return '#a855f7';
                  case 'text': return '#10b981';
                  case 'camera': return '#8b5cf6';
                  case 'masterPrompt': return '#a855f7';
                  case 'modifier': return '#f59e0b';
                  case 'generator': return '#06b6d4';
                  default: return '#64748b';
                }
              }}
              maskColor="rgba(0, 0, 0, 0.6)"
              style={{
                background: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            />

            {/* Empty state */}
            {nodes.length === 0 && <CanvasEmptyState />}

          </ReactFlow>
        </ReactFlowProvider>

        {suggestMenu && (
          <ConnectSuggestMenu
            x={suggestMenu.x}
            y={suggestMenu.y}
            onClose={() => setSuggestMenu(null)}
            onPick={(type) => {
              if (!rf) return;
              // Convert screen coords to flow coords and place node slightly to the right
              const pos = rf.screenToFlowPosition({ x: suggestMenu.x, y: suggestMenu.y });
              const newId = addNodeAt(type as NodeType, { x: pos.x + 140, y: pos.y - 80 });
              onConnect({ source: suggestMenu.sourceNodeId, target: newId, sourceHandle: null, targetHandle: null });
              setSuggestMenu(null);
              setConnectStart(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithErrorBoundary;
