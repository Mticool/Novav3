export interface NodeData {
  title?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  state?: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  progress?: number;
}

