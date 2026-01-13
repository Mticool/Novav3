// Node type definitions with their input/output compatibility
export type DataType = 'text' | 'image' | 'video' | 'any';

export interface NodeTypeDefinition {
  inputs: DataType[];
  outputs: DataType[];
}

// Define what each node type accepts and produces
export const NODE_TYPE_DEFINITIONS: Record<string, NodeTypeDefinition> = {
  // Source nodes
  text: {
    inputs: [],
    outputs: ['text'],
  },
  imageUpload: {
    inputs: [],
    outputs: ['image'],
  },
  
  // Generator nodes
  image: {
    inputs: ['text'],
    outputs: ['image'],
  },
  video: {
    inputs: ['text', 'image'],
    outputs: ['video'],
  },
  
  // Processing nodes
  enhancement: {
    inputs: ['image'],
    outputs: ['image'],
  },
  camera: {
    inputs: ['image'],
    outputs: ['image'],
  },
  cameraAngle: {
    inputs: ['image'],
    outputs: ['image'],
  },
  generator: {
    inputs: ['image', 'video'],
    outputs: ['image', 'video'],
  },
  
  // AI nodes
  masterPrompt: {
    inputs: ['text', 'image'],
    outputs: ['text'],
  },
  modifier: {
    inputs: ['text', 'image'],
    outputs: ['text', 'image'],
  },
  
  // Utility nodes
  arraySplitter: {
    inputs: ['any'],
    outputs: ['any'],
  },
  comment: {
    inputs: [],
    outputs: [],
  },
};

/**
 * Check if a connection between two node types is valid
 */
export function isValidConnection(
  sourceType: string,
  targetType: string
): { valid: boolean; reason?: string } {
  // Get node definitions
  const sourceDef = NODE_TYPE_DEFINITIONS[sourceType];
  const targetDef = NODE_TYPE_DEFINITIONS[targetType];

  if (!sourceDef || !targetDef) {
    return {
      valid: false,
      reason: 'Unknown node type',
    };
  }

  // Comment nodes can't connect
  if (sourceType === 'comment' || targetType === 'comment') {
    return {
      valid: false,
      reason: 'Comment nodes cannot be connected',
    };
  }

  // Source must have outputs
  if (sourceDef.outputs.length === 0) {
    return {
      valid: false,
      reason: 'Source node has no outputs',
    };
  }

  // Target must have inputs
  if (targetDef.inputs.length === 0) {
    return {
      valid: false,
      reason: 'Target node has no inputs',
    };
  }

  // Check type compatibility
  const hasCompatibleType = sourceDef.outputs.some((outputType) =>
    targetDef.inputs.some((inputType) => {
      // 'any' type accepts everything
      if (inputType === 'any' || outputType === 'any') return true;
      
      // Direct type match
      if (inputType === outputType) return true;
      
      // Special cases
      // Text can connect to video (text-to-video)
      if (outputType === 'text' && inputType === 'video') return true;
      
      return false;
    })
  );

  if (!hasCompatibleType) {
    return {
      valid: false,
      reason: `Incompatible types: ${sourceDef.outputs.join('/')} → ${targetDef.inputs.join('/')}`,
    };
  }

  return { valid: true };
}

/**
 * Get a user-friendly error message for invalid connections
 */
export function getConnectionErrorMessage(sourceType: string, targetType: string): string {
  const result = isValidConnection(sourceType, targetType);
  
  if (result.valid) {
    return '';
  }

  const messages: Record<string, string> = {
    'text-video': 'Подключите текстовую ноду к Image ноде, затем к Video',
    'image-text': 'Изображение не может быть входом для текста',
    'video-image': 'Видео не может быть входом для изображения',
  };

  const key = `${sourceType}-${targetType}`;
  return messages[key] || result.reason || 'Incompatible connection';
}

/**
 * Check if a connection would create a cycle
 */
export function wouldCreateCycle(
  edges: Array<{ source: string; target: string }>,
  newSource: string,
  newTarget: string
): boolean {
  // Create adjacency list
  const graph = new Map<string, string[]>();
  
  // Add existing edges
  edges.forEach(({ source, target }) => {
    if (!graph.has(source)) graph.set(source, []);
    graph.get(source)!.push(target);
  });

  // Add new edge
  if (!graph.has(newSource)) graph.set(newSource, []);
  graph.get(newSource)!.push(newTarget);

  // DFS to detect cycle
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycle(node: string): boolean {
    if (recStack.has(node)) return true; // Cycle detected
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  }

  // Check for cycles starting from new source
  return hasCycle(newSource);
}
