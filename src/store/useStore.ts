import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { generateText, generateImage, generateVideo, rotateCharacter, AI_MODELS } from '../lib/api';

type NodeType = 'text' | 'image' | 'video' | 'masterPrompt' | 'modifier' | 'generator' | 'camera' | 'imageUpload' | 'arraySplitter' | 'comment' | 'enhancement' | 'cameraAngle';

interface HistorySnapshot {
  nodes: Node[];
  edges: Edge[];
}

interface StoreState {
  nodes: Node[];
  edges: Edge[];
  projectName: string;
  credits: number;
  view: 'landing' | 'editor';
  
  // History
  past: HistorySnapshot[];
  future: HistorySnapshot[];

  // Actions
  setView: (view: 'landing' | 'editor') => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: NodeType) => void;
  addNodeAt: (type: NodeType, position: { x: number; y: number }) => string;
  deleteNode: (id: string) => void;
  updateNode: (id: string, data: Record<string, unknown>) => void;
  setProjectName: (name: string) => void;

  // AI Generation
  generateFromText: (textNodeId: string, targetNodeId: string) => Promise<void>;
  generateVideoFromImage: (imageNodeId: string, videoNodeId: string) => Promise<void>;
  improvePrompt: (nodeId: string) => Promise<void>;
  rotateCamera: (imageNodeId: string, cameraNodeId: string, angle: number, view: string) => Promise<void>;

  // CASCADE EXECUTION
  getParentNodes: (nodeId: string) => string[];
  executeNodeChain: (targetNodeId: string) => Promise<void>;
  regenerateNode: (nodeId: string) => Promise<void>;

  // WORKFLOW TEMPLATES
  saveWorkflow: () => string;
  loadWorkflow: (json: string) => void;
  clearWorkflow: () => void;
  createChain: (type: 'text-to-video' | 'change-background' | 'first-frame' | 'audio-to-video') => void;
  
  // HISTORY (Undo/Redo)
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
}

export const useStore = create<StoreState>()((set, get) => ({
  // Initial state - UGC VIDEO WORKFLOW TEMPLATE (Pletor.ai style)
  // Workflow: Text → Image → Video (Sora 2) + ImageUpload → Video (Reference)
  nodes: [
    // === СЕКЦИЯ: UGC РОЛИК ===
    {
      id: 'comment_ugc',
      type: 'comment',
      position: { x: 80, y: 40 },
      data: {
        title: '📱 UGC: Распаковка для TikTok / Instagram',
      },
    },
    // === ПРОМПТ ДЛЯ UGC РОЛИКА ===
    {
      id: 'ugc_prompt_1',
      type: 'text',
      position: { x: 80, y: 120 },
      data: {
        title: 'UGC Промпт',
        content: `Девушка 25-30 лет делает распаковку косметики в стиле UGC для TikTok. На столе — баночка крема Yves Rocher "Glow Energie" с золотистой крышкой. Она открывает коробку, достает баночку, показывает текстуру крема на руке. Мягкий естественный свет из окна, уютная домашняя атмосфера. Формат вертикальный 9:16, съемка на смартфон, живой и искренний стиль.`,
        state: 'idle',
      },
    },
    // === ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЯ ===
    {
      id: 'ugc_image_1',
      type: 'image',
      position: { x: 450, y: 120 },
      data: {
        title: 'Первый кадр',
        state: 'idle',
        settings: {
          model: 'gpt-image-1.5',
          resolution: 'portrait_hd',
          steps: 28,
          guidance: 7.5,
        },
      },
    },
    // === ГЕНЕРАЦИЯ ВИДЕО (SORA 2) ===
    {
      id: 'ugc_video_1',
      type: 'video',
      position: { x: 820, y: 120 },
      data: {
        title: 'UGC Видео',
        state: 'idle',
        settings: {
          model: 'sora-2',
          resolution: 'portrait_hd',
          duration: 5,
          fps: 24,
        },
      },
    },
    // === СЕКЦИЯ: РЕФЕРЕНС ПРОДУКТА ===
    {
      id: 'comment_reference',
      type: 'comment',
      position: { x: 80, y: 320 },
      data: {
        title: '🖼️ Референс: Фото продукта → Видео',
      },
    },
    // === ЗАГРУЗКА ИЗОБРАЖЕНИЯ ПРОДУКТА ===
    {
      id: 'product_image',
      type: 'imageUpload',
      position: { x: 80, y: 400 },
      data: {
        title: 'Фото продукта',
        state: 'idle',
      },
    },
    // === ВИДЕО ИЗ РЕФЕРЕНСА ===
    {
      id: 'product_video',
      type: 'video',
      position: { x: 450, y: 400 },
      data: {
        title: 'Видео с продуктом',
        state: 'idle',
        settings: {
          model: 'kling-2.6',
          resolution: 'landscape_hd',
          duration: 5,
          fps: 24,
        },
      },
    },
  ],
  edges: [
    // UGC path: Text → Image → Video
    {
      id: 'e_prompt_to_image',
      source: 'ugc_prompt_1',
      target: 'ugc_image_1',
    },
    {
      id: 'e_image_to_video',
      source: 'ugc_image_1',
      target: 'ugc_video_1',
    },
    // Reference path: ImageUpload → Video
    {
      id: 'e_product_to_video',
      source: 'product_image',
      target: 'product_video',
    },
  ],
  projectName: 'UGC Косметика — Yves Rocher',
  credits: 285,
  view: 'landing',
  
  // History state
  past: [],
  future: [],

  // Actions
  setView: (view: 'landing' | 'editor') => set({ view }),

  // React Flow callbacks
  onNodesChange: (changes: NodeChange[]) => {
    // Save to history before change
    get().saveToHistory();
    
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    // Save to history before change
    get().saveToHistory();
    
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    // Save to history before change
    get().saveToHistory();
    
    set({
      edges: addEdge(
        { ...connection },
        get().edges
      ),
    });
  },

  // Custom actions
  addNode: (type: NodeType) => {
    try {
      console.log('🎯 Adding node of type:', type);

      // Russian node titles
      const nodeTitles: Record<NodeType, string> = {
        text: 'Текст',
        image: 'Генератор изображений',
        video: 'Генератор видео',
        masterPrompt: 'Помощник',
        modifier: 'Модификатор',
        generator: 'Улучшение качества',
        camera: 'Камера',
        imageUpload: 'Загрузка изображения',
        arraySplitter: 'Array Splitter',
        comment: 'Комментарий',
        enhancement: 'Улучшение изображения',
        cameraAngle: 'Угол камеры',
      };

      const currentNodes = get().nodes;
      const nodeCount = currentNodes.filter(n => n.type === type).length + 1;

      // Smart positioning: Place at a reasonable center position
      // Use a fixed base position with slight variation to avoid exact stacking
      const baseX = 400;
      const baseY = 300;

      // Add a small random offset to prevent perfect overlap
      const offsetX = (currentNodes.length % 5) * 40;
      const offsetY = (currentNodes.length % 5) * 40;

      const newX = baseX + offsetX;
      const newY = baseY + offsetY;

      const newNode: Node = {
        id: `${type}_${Date.now()}`,
        type,
        position: {
          x: newX,
          y: newY,
        },
        data: {
          title: `${nodeTitles[type]} #${nodeCount}`,
          state: 'idle',
          ...(type === 'text' && { content: '' }),
          ...(type === 'image' && {
            settings: {
              model: 'nano-banana-pro',
              resolution: 'square_hd',
              steps: 28,
              guidance: 7.5,
              seed: -1
            }
          }),
          ...(type === 'video' && {
            settings: {
              model: 'kling-2.6',
              resolution: 'landscape_hd',
              duration: 5,
              fps: 24
            }
          }),
          ...(type === 'masterPrompt' && { content: '' }),
          ...(type === 'modifier' && { modifierType: 'angle', selectedOption: 'Крупный план' }),
          ...(type === 'generator' && { generationType: 'image', selectedModel: 'flux-dev' }),
          ...(type === 'camera' && { angle: 0, view: 'front' }),
          ...(type === 'enhancement' && { params: { sharpness: 50, contrast: 50 } }),
          ...(type === 'cameraAngle' && { params: { rotate: 0, vertical: 0, zoom: 1 } }),
        },
      };

      console.log('✅ Node created:', newNode);

      set({
        nodes: [...currentNodes, newNode],
      });

      console.log('✅ Node added to store');
    } catch (error) {
      console.error('❌ Error adding node:', error);
      alert('Ошибка при добавлении узла: ' + (error as Error).message);
    }
  },

  addNodeAt: (type: NodeType, position: { x: number; y: number }) => {
    // Russian node titles
    const nodeTitles: Record<NodeType, string> = {
      text: 'Текст',
      image: 'Генератор изображений',
      video: 'Генератор видео',
      masterPrompt: 'Помощник',
      modifier: 'Модификатор',
      generator: 'Улучшение качества',
      camera: 'Камера',
      imageUpload: 'Загрузка изображения',
      arraySplitter: 'Array Splitter',
      comment: 'Комментарий',
      enhancement: 'Улучшение изображения',
      cameraAngle: 'Угол камеры',
    };

    const currentNodes = get().nodes;
    const nodeCount = currentNodes.filter(n => n.type === type).length + 1;
    const id = `${type}_${Date.now()}`;

    const newNode: Node = {
      id,
      type,
      position,
      data: {
        title: `${nodeTitles[type]} #${nodeCount}`,
        state: 'idle',
        ...(type === 'text' && { content: '' }),
        ...(type === 'image' && {
          settings: {
            model: 'seedream-4.5',
            resolution: 'square_hd',
            steps: 28,
            guidance: 7.5,
            seed: -1,
            variants: 1,
          },
        }),
        ...(type === 'video' && {
          settings: {
            model: 'kling-2.6',
            resolution: 'landscape_hd',
            duration: 5,
            fps: 24,
            soundFx: false,
          },
        }),
        ...(type === 'masterPrompt' && { content: '' }),
        ...(type === 'modifier' && { modifierType: 'angle', selectedOption: 'Крупный план' }),
        ...(type === 'generator' && { generationType: 'image', selectedModel: 'flux-dev' }),
        ...(type === 'camera' && { angle: 0, view: 'front' }),
        ...(type === 'enhancement' && { params: { sharpness: 50, contrast: 50 } }),
        ...(type === 'cameraAngle' && { params: { rotate: 0, vertical: 0, zoom: 1 } }),
      },
    };

    set({ nodes: [...currentNodes, newNode] });
    return id;
  },

  deleteNode: (id: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    });
  },

  updateNode: (id: string, data: Record<string, unknown>) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  setProjectName: (name: string) => {
    set({ projectName: name });
  },

  // AI Generation Methods
  generateFromText: async (textNodeId: string, targetNodeId: string) => {
    const textNode = get().nodes.find(n => n.id === textNodeId);
    const targetNode = get().nodes.find(n => n.id === targetNodeId);

    if (!textNode || !targetNode) return;

    const prompt = textNode.data.content as string;
    if (!prompt) {
      get().updateNode(targetNodeId, {
        state: 'error',
        error: 'No prompt provided'
      });
      return;
    }

    // Set loading state
    get().updateNode(targetNodeId, {
      state: 'loading',
      progress: 0
    });

    try {
      if (targetNode.type === 'image') {
        // Use model from node settings or default to QUALITY
        const nodeSettings = typeof targetNode.data.settings === 'object' && targetNode.data.settings !== null
          ? targetNode.data.settings as Record<string, unknown>
          : {};
        const model = (nodeSettings?.model as string) || AI_MODELS.IMAGE.QUALITY;
        const imageUrl = await generateImage(
          prompt,
          model,
          {
            image_size: nodeSettings?.resolution as string,
            steps: nodeSettings?.steps as number,
            guidance: nodeSettings?.guidance as number,
            seed: nodeSettings?.seed as number,
          }
        );
        get().updateNode(targetNodeId, {
          imageUrl,
          state: 'success',
          progress: 100
        });
      } else if (targetNode.type === 'video') {
        // Use model from node settings or default to REALISTIC
        const nodeSettings = typeof targetNode.data.settings === 'object' && targetNode.data.settings !== null
          ? targetNode.data.settings as Record<string, unknown>
          : {};
        const model = (nodeSettings?.model as string) || AI_MODELS.VIDEO.REALISTIC;
        const videoUrl = await generateVideo(
          prompt,
          model,
          {
            imageUrl: undefined, // Text to video
            image_size: nodeSettings?.resolution as string,
            duration: nodeSettings?.duration as number,
            fps: nodeSettings?.fps as number,
            guidance: nodeSettings?.guidance as number,
          }
        );
        get().updateNode(targetNodeId, {
          videoUrl,
          state: 'success',
          progress: 100
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Generation failed';
      console.error('Generation execution error:', error);
      alert(`Ошибка генерации: ${errorMessage}`);
      get().updateNode(targetNodeId, {
        state: 'error',
        error: errorMessage
      });
    }
  },

  generateVideoFromImage: async (imageNodeId: string, videoNodeId: string) => {
    const imageNode = get().nodes.find(n => n.id === imageNodeId);
    const videoNode = get().nodes.find(n => n.id === videoNodeId);

    if (!imageNode || !videoNode) return;

    const imageUrl = imageNode.data.imageUrl as string;
    const prompt = imageNode.data.title || 'Generate video from this image';

    if (!imageUrl) {
      get().updateNode(videoNodeId, {
        state: 'error',
        error: 'No image provided'
      });
      return;
    }

    get().updateNode(videoNodeId, {
      state: 'loading',
      progress: 0
    });

    try {
      // Use model from node settings or default
      const nodeSettings = typeof videoNode.data.settings === 'object' && videoNode.data.settings !== null
        ? videoNode.data.settings as Record<string, unknown>
        : {};
      const model = (nodeSettings?.model as string) || AI_MODELS.VIDEO.REALISTIC;
      const videoUrl = await generateVideo(
        prompt as string,
        model,
        {
          imageUrl,
          image_size: nodeSettings?.resolution as string,
          duration: nodeSettings?.duration as number,
          fps: nodeSettings?.fps as number,
          guidance: nodeSettings?.guidance as number,
        }
      );
      get().updateNode(videoNodeId, {
        videoUrl,
        state: 'success',
        progress: 100
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Video generation failed';
      console.error('Video generation error:', error);
      alert(`Ошибка генерации видео: ${errorMessage}`);
      get().updateNode(videoNodeId, {
        state: 'error',
        error: errorMessage
      });
    }
  },

  improvePrompt: async (nodeId: string) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Check for incoming connections (Image -> Master Prompt)
    const incomingEdges = get().edges.filter(e => e.target === nodeId);
    const imageUrls: string[] = [];

    incomingEdges.forEach(edge => {
      const sourceNode = get().nodes.find(n => n.id === edge.source);
      if (sourceNode && (sourceNode.type === 'image' || sourceNode.type === 'imageUpload')) {
        const url = sourceNode.data.imageUrl as string;
        if (url) imageUrls.push(url);
      }
    });

    if (imageUrls.length > 0) {
      console.log('👁️ Vision Context Found:', imageUrls.length, 'images detected');
    }

    if (!node.data.content && imageUrls.length === 0) return;

    // Set loading state
    get().updateNode(nodeId, { state: 'loading' });

    try {
      const improvedPrompt = await generateText((node.data.content as string) || 'Describe these images', imageUrls);

      get().updateNode(nodeId, {
        content: improvedPrompt,
        state: 'success'
      });

      // Reset state after 3 seconds
      setTimeout(() => {
        get().updateNode(nodeId, { state: 'idle' });
      }, 3000);

    } catch (error: unknown) {
      console.error('Failed to improve prompt:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to improve prompt';
      alert(`Ошибка улучшения: ${errorMessage}`);
      get().updateNode(nodeId, {
        state: 'error',
        error: errorMessage
      });
    }
  },

  rotateCamera: async (imageNodeId: string, cameraNodeId: string, angle: number, view: string) => {
    const imageNode = get().nodes.find(n => n.id === imageNodeId);
    const imageUrl = imageNode?.data.imageUrl;

    if (!imageUrl) {
      get().updateNode(cameraNodeId, {
        state: 'error',
        error: 'No input image provided'
      });
      alert('Ошибка: Нет изображения для обработки');
      return;
    }

    // Store input image in camera node
    get().updateNode(cameraNodeId, {
      state: 'loading',
      inputImage: imageUrl,
      outputImage: null
    });

    try {
      const rotatedImageUrl = await rotateCharacter(imageUrl as string, angle, view as 'front' | 'top' | 'bottom');
      get().updateNode(cameraNodeId, {
        outputImage: rotatedImageUrl,
        state: 'success'
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Camera rotation failed';
      console.error('Camera rotation error:', error);
      alert(`Ошибка вращения: ${errorMessage}`);
      get().updateNode(cameraNodeId, {
        state: 'error',
        error: errorMessage
      });
    }
  },

  // ==================== CASCADE EXECUTION ====================

  // Find all parent nodes recursively
  getParentNodes: (nodeId: string): string[] => {
    const edges = get().edges;
    const visited = new Set<string>();
    const parents: string[] = [];
    let depth = 0;
    const MAX_DEPTH = 20; // Защита от бесконечной рекурсии

    const findParents = (id: string) => {
      depth++;
      if (depth > MAX_DEPTH) {
        console.warn('⚠️ Max recursion depth reached in getParentNodes');
        return;
      }

      if (visited.has(id)) return;
      visited.add(id);

      const incomingEdges = edges.filter(e => e.target === id);
      incomingEdges.forEach(edge => {
        if (!visited.has(edge.source)) {
          parents.push(edge.source);
          findParents(edge.source);
        }
      });
    };

    try {
      findParents(nodeId);
      return parents.reverse(); // От корня к листу
    } catch (error) {
      console.error('❌ Error in getParentNodes:', error);
      return [];
    }
  },

  // Execute entire chain automatically
  executeNodeChain: async (targetNodeId: string) => {
    try {
      const nodes = get().nodes;
      const targetNode = nodes.find(n => n.id === targetNodeId);

      if (!targetNode) {
        console.log('❌ Target node not found:', targetNodeId);
        return;
      }

      console.log('🚀 Starting cascade execution for:', targetNodeId);

      // Find all parent nodes with safety check
      const parentIds = get().getParentNodes(targetNodeId);

      if (parentIds.length > 10) {
        console.warn('⚠️ Too many parent nodes, possible circular dependency');
        alert('Ошибка: Слишком сложная цепочка или циклическая зависимость');
        return;
      }

      const executionChain = [...parentIds, targetNodeId];
      console.log('📋 Execution chain:', executionChain);

      // Execute each node in order
      for (const nodeId of executionChain) {
        const currentNode = get().nodes.find(n => n.id === nodeId);
        if (!currentNode) {
          console.log('⚠️ Node not found:', nodeId);
          continue;
        }

        // Skip if node is text-only (no generation needed)
        if (currentNode.type === 'text' || currentNode.type === 'masterPrompt') {
          console.log('⏭️ Skipping text node:', nodeId);
          continue;
        }

        // Find incoming edges for this node
        const incomingEdges = get().edges.filter(e => e.target === nodeId);
        if (incomingEdges.length === 0) {
          console.log('⚠️ No incoming edges for:', nodeId);
          continue;
        }

        // Get source node
        const sourceEdge = incomingEdges[0];
        const sourceNode = get().nodes.find(n => n.id === sourceEdge.source);
        if (!sourceNode) {
          console.log('⚠️ Source node not found');
          continue;
        }

        console.log('🔄 Executing:', currentNode.type, nodeId);

        // Execute based on node type
        try {
          if (currentNode.type === 'image') {
            if (sourceNode.type === 'text' || sourceNode.type === 'masterPrompt') {
              await get().generateFromText(sourceNode.id, nodeId);
            }
          } else if (currentNode.type === 'video') {
            if (sourceNode.type === 'image') {
              await get().generateVideoFromImage(sourceNode.id, nodeId);
            } else if (sourceNode.type === 'text' || sourceNode.type === 'masterPrompt') {
              await get().generateFromText(sourceNode.id, nodeId);
            }
          } else if (currentNode.type === 'camera') {
            if (sourceNode.type === 'image' && sourceNode.data.imageUrl) {
              const nodeData = currentNode.data as Record<string, unknown>;
              const angle = (nodeData?.angle as number) || 0;
              const view = (nodeData?.view as string) || 'front';
              await get().rotateCamera(sourceNode.id, nodeId, angle, view);
            }
          }
        } catch (error) {
          console.error('❌ Error executing node:', nodeId, error);
          get().updateNode(nodeId, {
            state: 'error',
            error: 'Execution failed: ' + (error as Error).message
          });
        }

        // Wait a bit between executions
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      console.log('✅ Cascade execution completed!');
    } catch (error) {
      console.error('❌ Fatal error in executeNodeChain:', error);
      alert('Ошибка выполнения цепочки: ' + (error as Error).message);
    }
  },

  // Regenerate single node
  regenerateNode: async (nodeId: string) => {
    const nodes = get().nodes;
    const edges = get().edges;
    const node = nodes.find(n => n.id === nodeId);

    if (!node) return;

    console.log('🔄 Regenerating node:', nodeId);

    // Find incoming edge
    const incomingEdge = edges.find(e => e.target === nodeId);
    if (!incomingEdge) {
      console.log('⚠️ No incoming edge for regeneration');
      return;
    }

    const sourceNode = nodes.find(n => n.id === incomingEdge.source);
    if (!sourceNode) return;

    // Execute based on type
    if (node.type === 'image') {
      if (sourceNode.type === 'text' || sourceNode.type === 'masterPrompt') {
        await get().generateFromText(sourceNode.id, nodeId);
      }
    } else if (node.type === 'video') {
      if (sourceNode.type === 'image') {
        await get().generateVideoFromImage(sourceNode.id, nodeId);
      } else if (sourceNode.type === 'text' || sourceNode.type === 'masterPrompt') {
        await get().generateFromText(sourceNode.id, nodeId);
      }
    } else if (node.type === 'camera') {
      if (sourceNode.type === 'image' && sourceNode.data.imageUrl) {
        const nodeData = node.data as Record<string, unknown>;
        const angle = (nodeData?.angle as number) || 0;
        const view = (nodeData?.view as string) || 'front';
        await get().rotateCamera(sourceNode.id, nodeId, angle, view);
      }
    }

    console.log('✅ Node regenerated!');
  },

  // ==================== WORKFLOW TEMPLATES ====================

  saveWorkflow: () => {
    const { nodes, edges, projectName } = get();
    const workflow = {
      version: '1.0',
      name: projectName,
      createdAt: new Date().toISOString(),
      nodes: nodes.map(n => ({
        ...n,
        // Strip transient data
        data: {
          ...n.data,
          state: 'idle',
          progress: undefined,
          error: undefined,
        }
      })),
      edges,
    };
    return JSON.stringify(workflow, null, 2);
  },

  loadWorkflow: (json: string) => {
    try {
      const workflow = JSON.parse(json);

      if (!workflow.nodes || !workflow.edges) {
        throw new Error('Invalid workflow format');
      }

      // 🛡️ Auto-layout check: If many nodes are at (0,0) or overlapping heavily
      let loadedNodes = workflow.nodes as Node[];
      const zeroPosNodes = loadedNodes.filter((n: Node) => n.position.x === 0 && n.position.y === 0).length;

      if (zeroPosNodes > 1 || loadedNodes.every(n => n.position.x === loadedNodes[0].position.x && n.position.y === loadedNodes[0].position.y)) {
        console.log('⚠️ Detected overlapping nodes in template, applying auto-layout...');
        loadedNodes = loadedNodes.map((node, index) => ({
          ...node,
          position: {
            x: 100 + (index % 3) * 350, // 3 columns
            y: 100 + Math.floor(index / 3) * 300
          }
        }));
      }

      set({
        nodes: loadedNodes,
        edges: workflow.edges,
        projectName: workflow.name || 'Imported Workflow',
      });

      console.log('✅ Workflow loaded:', workflow.name);
    } catch (error) {
      console.error('❌ Failed to load workflow:', error);
      alert('Ошибка загрузки workflow: ' + (error as Error).message);
    }
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      projectName: 'Новый проект',
    });

    // 🧹 Force clear local storage to prevent auto-restore of old data
    try {
      localStorage.removeItem('nodav3_autosave');
      localStorage.removeItem('nodav3_last_save');
      console.log('🗑️ Workflow and LocalStorage cleared');
    } catch (e) {
      console.error('Failed to clear local storage', e);
    }
  }, // Close clearWorkflow

  createChain: (type) => {
    const { addNodeAt, onConnect } = get();
    // Center point for first node
    const startX = window.innerWidth / 2 - 200;
    const startY = window.innerHeight / 2 - 150;

    if (type === 'text-to-video') {
      const textId = addNodeAt('text', { x: startX, y: startY });
      const videoId = addNodeAt('video', { x: startX + 400, y: startY });
      onConnect({ source: textId, target: videoId, sourceHandle: null, targetHandle: null });
    } else if (type === 'change-background') {
      const imgId = addNodeAt('imageUpload', { x: startX, y: startY });
      const modId = addNodeAt('modifier', { x: startX + 400, y: startY });
      get().updateNode(modId, { modifierType: 'background', title: 'Change Background' });
      onConnect({ source: imgId, target: modId, sourceHandle: null, targetHandle: null });
    } else if (type === 'first-frame') {
      const imgId = addNodeAt('imageUpload', { x: startX, y: startY });
      const videoId = addNodeAt('video', { x: startX + 400, y: startY });
      onConnect({ source: imgId, target: videoId, sourceHandle: null, targetHandle: null });
    } else if (type === 'audio-to-video') {
      // Placeholder for Audio since we don't have it explicitly, using UniversalInput as generic media
      const audioId = addNodeAt('text', { x: startX, y: startY });
      get().updateNode(audioId, { title: 'Audio Prompt', content: 'Upload audio here...' });
      const videoId = addNodeAt('video', { x: startX + 400, y: startY });
      onConnect({ source: audioId, target: videoId, sourceHandle: null, targetHandle: null });
    }
  },

  // ==================== HISTORY (UNDO/REDO) ====================

  saveToHistory: () => {
    const { nodes, edges, past } = get();
    
    // Check if last snapshot is the same (avoid duplicates)
    const lastSnapshot = past[past.length - 1];
    if (lastSnapshot && 
        JSON.stringify(lastSnapshot.nodes) === JSON.stringify(nodes) &&
        JSON.stringify(lastSnapshot.edges) === JSON.stringify(edges)) {
      return; // No changes, skip
    }

    const snapshot: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };

    const newPast = [...past, snapshot].slice(-50); // Keep max 50 snapshots

    set({
      past: newPast,
      future: [], // Clear future on new action
    });

    console.log('💾 History saved:', newPast.length, 'snapshots');
  },

  undo: () => {
    const { past, future, nodes, edges } = get();
    
    if (past.length === 0) {
      console.log('⚠️ Nothing to undo');
      return;
    }

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    // Save current state to future
    const currentSnapshot: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: newPast,
      future: [currentSnapshot, ...future].slice(0, 50),
    });

    console.log('⏪ Undo:', newPast.length, 'past,', future.length + 1, 'future');
  },

  redo: () => {
    const { past, future, nodes, edges } = get();
    
    if (future.length === 0) {
      console.log('⚠️ Nothing to redo');
      return;
    }

    const next = future[0];
    const newFuture = future.slice(1);
    
    // Save current state to past
    const currentSnapshot: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };

    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, currentSnapshot].slice(-50),
      future: newFuture,
    });

    console.log('⏩ Redo:', past.length + 1, 'past,', newFuture.length, 'future');
  },

  canUndo: () => {
    return get().past.length > 0;
  },

  canRedo: () => {
    return get().future.length > 0;
  },
}));

