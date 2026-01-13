import { ReactFlow, Background, MiniMap, ReactFlowProvider, ConnectionLineType, Connection, ReactFlowInstance, OnConnectStartParams, useViewport, Node as FlowNode, Edge as FlowEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useEffect } from 'react';
import { CanvasEmptyState } from './components/CanvasEmptyState';
import { LandingPage } from './components/LandingPage';

import { TextNode } from './components/nodes/TextNode';
import { ImageGeneratorNode } from './components/nodes/ImageGeneratorNode';
import { VideoGeneratorNode } from './components/nodes/VideoGeneratorNode';
import { MasterPromptNode } from './components/nodes/MasterPromptNode';
import { ModifierNode } from './components/nodes/ModifierNode';
import { GeneratorNode } from './components/nodes/GeneratorNode';
import { CameraNode } from './components/nodes/CameraNode';
import { ImageUploadNode } from './components/nodes/ImageUploadNode';
import { ArraySplitterNode } from './components/nodes/ArraySplitterNode';
import { CommentNode } from './components/nodes/CommentNode';
import { EnhancementNode } from './components/nodes/EnhancementNode';
import { CameraAngleNode } from './components/nodes/CameraAngleNode';
import { AssistantNode } from './components/nodes/AssistantNode';
import { ConnectSuggestMenu } from './components/ConnectSuggestMenu';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BottomControls } from './components/BottomControls';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import { LibraryPanel } from './components/LibraryPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { OnboardingTour } from './components/OnboardingTour';
import { ApiKeyPrompt } from './components/ApiKeyPrompt';
import { useStore } from './store/useStore';
import { hasApiKeys, updateApiKeys } from './lib/api';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import { isValidConnection, wouldCreateCycle, getConnectionErrorMessage } from './lib/nodeValidation';


const nodeTypes = {
  image: ImageGeneratorNode,
  text: TextNode,
  video: VideoGeneratorNode,
  masterPrompt: MasterPromptNode,
  modifier: ModifierNode,
  generator: GeneratorNode,
  camera: CameraNode,
  imageUpload: ImageUploadNode,
  arraySplitter: ArraySplitterNode,
  comment: CommentNode,
  enhancement: EnhancementNode,
  cameraAngle: CameraAngleNode,
  assistant: AssistantNode,
};

function App() {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const addNodeAt = useStore((state) => state.addNodeAt);
  const view = useStore((state) => state.view);

  if (view === 'landing') {
    return <LandingPage />;
  }

  const keys = hasApiKeys();

  return (
    <ReactFlowProvider>
      {!keys.hasKie && !keys.hasLaozhang && (
        <ApiKeyPrompt
          onSave={(openai, kie, laozhang) => {
            updateApiKeys(openai, kie, undefined, laozhang);
            window.location.reload();
          }}
        />
      )}
      <FlowEditor
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        addNodeAt={addNodeAt}
      />
    </ReactFlowProvider>
  );
}

function FlowEditor({ nodes, edges, onNodesChange, onEdgesChange, onConnect, addNodeAt }: any) {
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

  const { zoom } = useViewport();

  // Debug zoom level if needed
  useEffect(() => {
    console.log('[FlowEditor] Zoom level:', zoom);
  }, [zoom]);

  const zoomClass = zoom < 0.6 ? 'zoom-far' : zoom < 0.85 ? 'zoom-mid' : 'zoom-near';

  // Panels state
  const [showLibrary, setShowLibrary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);


  const handlePaneClick = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      setShowLibrary(true);
    }
  };


  useKeyboardShortcuts();
  useAutoSave(true);

  return (
    <div className={`h-screen w-screen bg-[#141414] flex overflow-hidden ${zoomClass}`}>
      {/* Onboarding */}
      <OnboardingTour />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Panels */}
      {showLibrary && <LibraryPanel onClose={() => setShowLibrary(false)} />}
      {showHistory && <HistoryPanel onClose={() => setShowHistory(true)} />}


      {/* Unified Sidebar (Left) - Tools, Add Nodes, Library, History */}
      <Sidebar
        onOpenLibrary={() => setShowLibrary(true)}
        onOpenHistory={() => setShowHistory(true)}
      />

      {/* Main area */}
      <div className="flex-1 relative">
        {/* TopBar */}
        <TopBar />

        {/* Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(c: Connection) => {
            // Validate connection
            if (c.source && c.target) {
              const sourceNode = nodes.find((n: FlowNode) => n.id === c.source);
              const targetNode = nodes.find((n: FlowNode) => n.id === c.target);

              if (sourceNode && targetNode) {
                // Check type compatibility
                const validation = isValidConnection(sourceNode.type || '', targetNode.type || '');

                if (!validation.valid) {
                  alert(`❌ Невозможно подключить: ${getConnectionErrorMessage(sourceNode.type || '', targetNode.type || '')}`);
                  setSuggestMenu(null);
                  setConnectStart(null);
                  return;
                }

                // Check for cycles
                if (wouldCreateCycle(edges.map((e: FlowEdge) => ({ source: e.source, target: e.target })), c.source, c.target)) {
                  alert('❌ Невозможно создать циклическую зависимость');
                  setSuggestMenu(null);
                  setConnectStart(null);
                  return;
                }

                // Simple neutral edge style (Pikaso)
                const styledConnection = {
                  ...c,
                  animated: false,
                  style: {
                    stroke: '#555555',
                    strokeWidth: 1.5,
                  },
                };

                setSuggestMenu(null);
                setConnectStart(null);
                onConnect(styledConnection);
                return;
              }
            }

            setSuggestMenu(null);
            setConnectStart(null);
            onConnect(c);
          }}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.Bezier}
          connectionLineStyle={{
            strokeWidth: 2,
            transition: 'all 0.2s ease'
          }}
          defaultEdgeOptions={{
            animated: false,
            style: {
              strokeWidth: 1.5,
              stroke: '#555555', // Neutral gray (Pikaso)
            },
            interactionWidth: 20,
            className: 'edge-hoverable',
          }}
          onInit={(instance) => setRf(instance)}
          onConnectStart={(_, params: OnConnectStartParams) => {
            if (params.nodeId) {
              setConnectStart({
                nodeId: params.nodeId,
                handleId: params.handleId,
                handleType: params.handleType,
              });
            }
          }}
          onConnectEnd={(event) => {
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
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={2}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={true}
          panOnScrollMode={'all' as any}
          fitView
          className="bg-[#141414]"
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          snapToGrid={true}
          snapGrid={[20, 20]}
          nodesDraggable={true}
          nodeDragThreshold={5}
          onPaneClick={handlePaneClick}
          preventScrolling={true}
        >
          <Background
            gap={20}
            size={1}
            color="rgba(255, 255, 255, 0.03)"
            style={{ backgroundColor: '#141414' }}
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

        {suggestMenu && (
          <ConnectSuggestMenu
            x={suggestMenu.x}
            y={suggestMenu.y}
            onClose={() => setSuggestMenu(null)}
            onPick={(type: any) => {
              if (!rf) return;
              const pos = rf.screenToFlowPosition({ x: suggestMenu.x, y: suggestMenu.y });
              const newId = addNodeAt(type, { x: pos.x + 140, y: pos.y - 80 });
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
