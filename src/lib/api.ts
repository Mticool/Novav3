import OpenAI from 'openai';
import { Client } from '@gradio/client';

// ==================== KIE.AI CONFIGURATION ====================

export const AI_MODELS = {
  IMAGE: {
    FAST: 'nano-banana-pro', // Nano Banana Pro - Ultra-fast (Google)
    QUALITY: 'gpt-image-1.5', // GPT Image 1.5 - High quality (OpenAI)
    CONSISTENCY: 'seedream-4.5', // Seedream 4.5 - Character consistency (ByteDance)
  },
  VIDEO: {
    CINEMA: 'veo-3.1', // Veo 3.1 - Cinematic quality (Google)
    REALISTIC: 'kling-2.6', // Kling 2.6 - Photorealistic (KuaiShou)
    FAST: 'kling-2.5-turbo', // Kling 2.5 Turbo - Fast generation
  },
  UPSCALE: {
    IMAGE: 'topaz-image-upscale', // Topaz Image Upscale
    VIDEO: 'topaz-video-upscaler', // Topaz Video Upscaler
  }
} as const;

// Extended model list with generation times (like Freepik Pikaso)
export const IMAGE_MODELS_EXTENDED = [
  // Nano Banana Pro (Laozhang.ai) - Different resolutions
  { id: 'nano-banana-pro-4k', name: 'Nano Banana Pro 4K', time: '~8s', quality: 'Ultra', category: 'quality', provider: 'laozhang' },
  { id: 'nano-banana-pro-2k', name: 'Nano Banana Pro 2K', time: '~5s', quality: 'High', category: 'quality', provider: 'laozhang' },
  { id: 'nano-banana-pro', name: 'Nano Banana Pro', time: '~3s', quality: 'High', category: 'fast', provider: 'laozhang' },
  // Fast models (Kie.ai)
  { id: 'z-image', name: 'Z-Image', time: '~5s', quality: 'High', category: 'fast', provider: 'kie' },
  // Quality models (Kie.ai)
  { id: 'gpt-image-1.5', name: 'GPT Image 1.5', time: '~8s', quality: 'Ultra', category: 'quality', provider: 'kie' },
  { id: 'seedream-4.5', name: 'Seedream 4.5', time: '~55s', quality: 'Max', category: 'quality', provider: 'kie' },
  { id: 'seedream-4.0', name: 'Seedream 4.0', time: '~27s', quality: 'Ultra', category: 'quality', provider: 'kie' },
  { id: 'grok-imagine', name: 'Grok Imagine', time: '~10s', quality: 'Ultra', category: 'quality', provider: 'kie' },
] as const;

export const VIDEO_MODELS_EXTENDED = [
  // Cinema / Pro models (Laozhang.ai)
  { id: 'sora-2-pro', name: 'Sora 2 Pro', time: '~90s', quality: 'Cinema', category: 'cinema', provider: 'laozhang' },
  { id: 'sora-2', name: 'Sora 2', time: '~60s', quality: 'Cinema', category: 'cinema', provider: 'laozhang' },
  { id: 'sora-2-landscape', name: 'Sora 2 Landscape', time: '~60s', quality: 'Cinema', category: 'cinema', provider: 'laozhang' },
  { id: 'sora-2-portrait', name: 'Sora 2 Portrait', time: '~60s', quality: 'Cinema', category: 'cinema', provider: 'laozhang' },
  { id: 'veo-3.1', name: 'Veo 3.1', time: '~60s', quality: 'Cinema', category: 'cinema', provider: 'laozhang' },
  { id: 'veo-3.1-fast', name: 'Veo 3.1 Fast', time: '~30s', quality: 'High', category: 'fast', provider: 'laozhang' },
  // Quality / Cinema models (Kie.ai)
  { id: 'kling-2.6-motion-control', name: 'Kling 2.6 Motion Control', time: '~60s', quality: 'Ultra', category: 'quality', provider: 'kie' },
  { id: 'seedance-1.5-pro', name: 'Seedance 1.5 Pro', time: '~55s', quality: 'Ultra', category: 'quality', provider: 'kie' },
  { id: 'wan-2.6', name: 'Wan 2.6', time: '~50s', quality: 'Ultra', category: 'quality', provider: 'kie' },
  { id: 'kling-2.6', name: 'Kling 2.6', time: '~45s', quality: 'Ultra', category: 'quality', provider: 'kie' },
  { id: 'grok-imagine', name: 'Grok Imagine', time: '~40s', quality: 'Ultra', category: 'quality', provider: 'kie' },
  // Fast models (Kie.ai)
  { id: 'kling-2.5-turbo', name: 'Kling 2.5 Turbo', time: '~25s', quality: 'High', category: 'fast', provider: 'kie' },
  { id: 'wan-2.5', name: 'Wan 2.5', time: '~30s', quality: 'High', category: 'fast', provider: 'kie' },
  { id: 'wan-2.2', name: 'Wan 2.2', time: '~20s', quality: 'Medium', category: 'fast', provider: 'kie' },
  { id: 'seedance-1.0', name: 'Seedance 1.0', time: '~25s', quality: 'High', category: 'fast', provider: 'kie' },
  { id: 'kling-2.1', name: 'Kling 2.1', time: '~30s', quality: 'High', category: 'fast', provider: 'kie' },
] as const;

// Upscale models for image and video enhancement
export const UPSCALE_MODELS_EXTENDED = [
  { id: 'topaz-image-upscale', name: 'Topaz Image Upscale', time: '~15s', type: 'image', maxScale: 4 },
  { id: 'topaz-video-upscaler', name: 'Topaz Video Upscaler', time: '~120s', type: 'video', maxScale: 4 },
] as const;

const KIE_BASE_URL = 'https://api.kie.ai/api/v1';
const LAOZHANG_BASE_URL = 'https://api.laozhang.ai/v1';

// ==================== API KEY MANAGEMENT ====================

const getOpenAIKey = () => {
  const key = localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY || '';
  return key.trim();
};

const getKieKey = () => {
  const key = localStorage.getItem('kie_api_key') || import.meta.env.VITE_KIE_KEY || '';
  return key.trim();
};

// Deprecated: For backwards compatibility
const getFalKey = () => {
  const key = localStorage.getItem('fal_api_key') || import.meta.env.VITE_FAL_KEY || '';
  return key.trim();
};

const getLaozhangKey = () => {
  const key = localStorage.getItem('laozhang_api_key') || import.meta.env.VITE_LAOZHANG_KEY || '';
  return key.trim();
};

// ==================== OPENAI INITIALIZATION ====================

let openai: OpenAI | null = null;
const initOpenAI = () => {
  const key = getOpenAIKey();
  if (key) {
    openai = new OpenAI({
      apiKey: key,
      dangerouslyAllowBrowser: true,
    });
  }
};

initOpenAI();

// ==================== KIE.AI CLIENT ====================

interface KieGenerationParams {
  model: string;
  prompt: string;
  negative_prompt?: string;
  image_size?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  duration?: number;
  fps?: number;
  image_url?: string; // For image-to-video
  aspectRatio?: string;
}


// Mapping of friendly IDs to API IDs
const MODEL_ID_MAP: Record<string, string | { text: string; image: string }> = {
  // Image Models
  'seedream-4.5': 'seedream/4.5-text-to-image',
  'gpt-image-1.5': 'openai/dall-e-3',
  'grok-imagine': 'grok-imagine/text-to-image',
  'flux-2': 'black-forest-labs/FLUX.1-dev', // Most common provider ID, fallback to 1-dev if 2 not available yet on all

  // Video Models (Text/Image variants)
  'veo-3.1': {
    text: 'veo3',
    image: 'veo3',
  },
  'sora-2': {
    text: 'sora-2-pro-text-to-video',
    image: 'sora-2-pro-image-to-video',
  },
  'kling-2.6': {
    text: 'kling-2.6/text-to-video',
    image: 'kling-2.6/image-to-video',
  },
  'kling-2.1': {
    text: 'kling/v2-1-pro',
    image: 'kling/v2-1-pro',
  },
  'wan-2.6': {
    text: 'wan/2-6-text-to-video',
    image: 'wan/2-6-image-to-video',
  },
  'hailuo-2': {
    text: 'minimax/hailuo-02', // Verified ID
    image: 'minimax/hailuo-02',
  },
  'seedance-1.5-pro': 'bytedance/seedance-1.5-pro',
  'bytedance-v1': {
    text: 'bytedance/v1-pro-text-to-video',
    image: 'bytedance/v1-pro-image-to-video',
  },
};

const resolveModelId = (modelId: string, type: 'text' | 'image' = 'text'): string => {
  const mapping = MODEL_ID_MAP[modelId];
  if (!mapping) return modelId; // Return original if no mapping found (e.g. nano-banana-pro)
  if (typeof mapping === 'string') return mapping;
  return type === 'image' ? mapping.image : mapping.text;
};

const resolveAspectRatio = (size: string = '1:1'): string => {
  const map: Record<string, string> = {
    'square_hd': '1:1',
    'square': '1:1',
    'landscape_hd': '16:9',
    'landscape': '16:9',
    'portrait_hd': '9:16',
    'portrait': '9:16',
  };
  return map[size] || size;
};

class KieClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = KIE_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async generateImage(params: KieGenerationParams): Promise<string> {
    try {
      const apiModel = resolveModelId(params.model, 'text');
      const apiRatio = resolveAspectRatio(params.image_size);
      console.log('🎨 Kie.ai Image Generation:', params.model, '->', apiModel, `(${apiRatio})`);

      const response = await fetch(`${this.baseUrl}/jobs/createTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: apiModel,
          input: {
            prompt: params.prompt,
            negativePrompt: params.negative_prompt || 'blurry, low quality, distorted',
            aspectRatio: apiRatio,
            numImages: 1,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          // ignore
        }
        throw new Error(errorJson?.msg || errorJson?.error || `Kie.ai API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const taskId = data.taskId || data.data?.taskId || data.id;

      if (!taskId) {
        console.error('Kie Response:', data);
        throw new Error('No taskId returned from API');
      }

      // Poll for completion
      return await this.pollForResult(taskId, 'image');
    } catch (error) {
      console.error('Kie.ai Image Error:', error);
      throw error;
    }
  }

  async generateVideo(params: KieGenerationParams): Promise<string> {
    try {
      const inputType = params.image_url ? 'image' : 'text';
      const apiModel = resolveModelId(params.model, inputType);
      const apiRatio = resolveAspectRatio(params.image_size || '16:9'); // Default to 16:9 for video if not specified

      // Smart Duration Resolution
      let validDuration = params.duration || 5;

      // Hailuo / Minimax: Usually supports 6s max for HD
      if (apiModel.includes('hailuo') || apiModel.includes('minimax')) {
        validDuration = Math.min(validDuration, 6);
      }
      // Wan: Supports 5, 10, 15. Min 5 usually (Turbo maybe 3). Map 3 -> 5 for standard.
      else if (apiModel.includes('wan')) {
        if (validDuration < 5) validDuration = 5;
      }
      // Kling: Supports 5, 10. Min 5.
      else if (apiModel.includes('kling')) {
        if (validDuration < 5) validDuration = 5;
        if (validDuration > 10) validDuration = 10;
      }

      console.log('🎬 Kie.ai Video Generation:', params.model, '->', apiModel, `(${validDuration}s)`);

      const response = await fetch(`${this.baseUrl}/jobs/createTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: apiModel,
          input: {
            prompt: params.prompt,
            duration: validDuration,
            aspectRatio: params.aspectRatio || apiRatio, // Use direct or resolved
            imageUrl: params.image_url,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          // ignore
        }
        throw new Error(errorJson?.msg || errorJson?.error || `Kie.ai API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const taskId = data.taskId || data.data?.taskId || data.id;

      if (!taskId) {
        throw new Error('No taskId returned from API');
      }

      // Poll for completion
      return await this.pollForResult(taskId, 'video');
    } catch (error) {
      console.error('Kie.ai Video Error:', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async pollForResult(taskId: string, _type: 'image' | 'video' = 'image', maxAttempts: number = 120): Promise<string> {
    console.log(`⏳ Polling for result: ${taskId}`);

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between polls

      try {
        const response = await fetch(`${this.baseUrl}/jobs/recordInfo?taskId=${taskId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        });

        if (!response.ok) continue;

        const data = await response.json();
        const record = data.data || data;
        const status = record.status || record.taskStatus || record.state;

        console.log(`📊 Task ${taskId} status: ${status}`);

        // Normalize status check
        const isSuccess = ['completed', 'success', 'SUCCESS'].includes(status);
        const isFailed = ['failed', 'error', 'FAILED'].includes(status);

        if (isSuccess) {
          // 1. Try to parse resultJson if it exists (Kie.ai common format)
          if (record.resultJson) {
            try {
              const parsed = typeof record.resultJson === 'string' ? JSON.parse(record.resultJson) : record.resultJson;
              // Check various formats inside resultJson
              const url = parsed.resultUrls?.[0] || parsed.url || parsed.images?.[0]?.url || parsed.videos?.[0]?.url;
              if (url) return url;
            } catch (e) {
              console.warn('Failed to parse resultJson:', e);
            }
          }

          // 2. Try standard fields
          const resultUrl =
            record.resultUrl ||
            record.result?.url ||
            record.output?.url ||
            record.images?.[0]?.url ||
            record.videos?.[0]?.url ||
            record.result?.images?.[0]?.url ||
            record.result?.videos?.[0]?.url ||
            record.result;

          if (resultUrl && typeof resultUrl === 'string') {
            return resultUrl;
          }
        }

        if (isFailed) {
          throw new Error(record.error || record.message || record.failMsg || 'Generation failed');
        }
      } catch (error) {
        if (i === maxAttempts - 1) throw error;
      }
    }

    throw new Error('Generation timeout - please try again');
  }
}

// ==================== PUBLIC API FUNCTIONS ====================

export function updateApiKeys(openaiKey?: string, kieKey?: string, falKey?: string, laozhangKey?: string) {
  if (openaiKey !== undefined) {
    localStorage.setItem('openai_api_key', openaiKey.trim());
    initOpenAI();
  }
  if (kieKey !== undefined) {
    localStorage.setItem('kie_api_key', kieKey.trim());
  }
  if (falKey !== undefined) {
    localStorage.setItem('fal_api_key', falKey.trim());
  }
  if (laozhangKey !== undefined) {
    localStorage.setItem('laozhang_api_key', laozhangKey.trim());
  }
}

export function hasApiKeys(): { hasKie: boolean; hasOpenAI: boolean; hasFal: boolean; hasLaozhang: boolean } {
  return {
    hasKie: !!getKieKey(),
    hasOpenAI: !!getOpenAIKey(),
    hasFal: !!getFalKey(),
    hasLaozhang: !!getLaozhangKey(),
  };
}

// ==================== OPENAI: Prompt Enhancement ====================

export async function generateText(prompt: string, imageUrls: string[] = []): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured. This feature requires OpenAI.');
  }
  try {
    const isVision = imageUrls.length > 0;
    const model = isVision ? 'gpt-4o' : 'gpt-4';

    const systemPrompt = isVision
      ? 'You are a computer vision expert and creative director. Analyze the provided images and create a highly detailed, cinematic, and high-quality image generation prompt that describes the subject, style, lighting, and atmosphere. If multiple images are provided (e.g. start and end frames), describe a coherent intermediate state or a consistent style that bridges them. The output should be optimized for AI image generators like Flux or Midjourney.'
      : 'You are a helpful AI assistant that improves and expands prompts for image generation. Make them more detailed, visually descriptive, and cinematic.';

    const userContent = isVision
      ? [
        { type: 'text', text: `Analyze these images and create a generation prompt. Additional context: "${prompt}"` },
        ...imageUrls.map(url => ({
          type: 'image_url',
          image_url: {
            url: url,
          },
        })),
      ]
      : `Improve this prompt for image generation: "${prompt}"`;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userContent as any,
        },
      ],
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || prompt;
  } catch (error) {
    console.error('OpenAI error:', error);
    throw error;
  }
}

// ==================== IMAGE GENERATION (Multi-Provider) ====================

// Image models that should be routed to laozhang.ai
const LAOZHANG_IMAGE_MODELS = ['nano-banana-pro', 'nano-banana-pro-2k', 'nano-banana-pro-4k'];

export async function generateImage(
  prompt: string,
  model: string = AI_MODELS.IMAGE.QUALITY,
  options?: {
    image_size?: string;
    steps?: number;
    guidance?: number;
    seed?: number;
  }
): Promise<string> {
  // Route to Laozhang.ai for Nano Banana Pro models
  if (LAOZHANG_IMAGE_MODELS.includes(model)) {
    const laozhangKey = getLaozhangKey();
    if (!laozhangKey) {
      throw new Error('Laozhang.ai API key not configured. Please add it for Nano Banana Pro models.');
    }

    // Map model to API model name
    const modelMap: Record<string, string> = {
      'nano-banana-pro': 'nano-banana-pro',
      'nano-banana-pro-2k': 'nano-banana-pro-2k',
      'nano-banana-pro-4k': 'nano-banana-pro-4k',
    };
    const apiModel = modelMap[model] || model;

    console.log('🖼️ Laozhang.ai Image Generation:', model, '->', apiModel);

    const response = await fetch(`${LAOZHANG_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${laozhangKey}`,
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Laozhang.ai API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Extract image URL from response
    if (typeof content === 'string') {
      if (content.startsWith('http')) return content;
      const urlMatch = content.match(/https?:\/\/[^\s"<>]+/);
      if (urlMatch) return urlMatch[0];
    }
    if (data.url) return data.url;
    if (data.image_url) return data.image_url;

    throw new Error('Could not extract image URL from response');
  }

  // Route to Kie.ai for other models
  const kieKey = getKieKey();
  if (!kieKey) {
    throw new Error('Kie.ai API key not configured. Please add it in settings.');
  }

  const client = new KieClient(kieKey);
  return await client.generateImage({
    model,
    prompt,
    image_size: options?.image_size || 'square_hd',
    num_inference_steps: options?.steps || 28,
    guidance_scale: options?.guidance || 7.5,
    seed: options?.seed || -1,
  });
}

// ==================== LAOZHANG.AI CLIENT (Sora 2 / Veo 3.1) ====================

// Models that should be routed to laozhang.ai (video only)
const LAOZHANG_MODELS = [
  'sora-2', 'sora-2-pro', 'sora-2-landscape', 'sora-2-portrait',
  'veo-3.1', 'veo-3.1-fast'
];

class LaozhangClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = LAOZHANG_BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async generateVideo(params: {
    model: string;
    prompt: string;
    imageUrl?: string;
    aspectRatio?: string;
    duration?: number;
  }): Promise<string> {
    try {
      // Map model ID to laozhang.ai model name
      const modelMap: Record<string, string> = {
        'sora-2': 'sora_video2',
        'sora-2-pro': 'sora_video2-pro',
        'sora-2-landscape': 'sora_video2-landscape',
        'sora-2-portrait': 'sora_video2-portrait',
        'veo-3.1': 'veo-3.1',
        'veo-3.1-fast': 'veo-3.1-fast',
      };

      const apiModel = modelMap[params.model] || params.model;
      console.log('🎬 Laozhang.ai Video Generation:', params.model, '->', apiModel);

      // Build message content (text or text + image)
      const userContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
        { type: 'text', text: params.prompt },
      ];

      if (params.imageUrl) {
        userContent.push({
          type: 'image_url',
          image_url: { url: params.imageUrl },
        });
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: apiModel,
          messages: [
            {
              role: 'user',
              content: userContent,
            },
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          // ignore
        }
        throw new Error(errorJson?.error?.message || errorJson?.msg || `Laozhang.ai API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Extract video URL from response
      const content = data.choices?.[0]?.message?.content;

      if (typeof content === 'string') {
        // Check if content is a URL
        if (content.startsWith('http')) {
          return content;
        }
        // Try to parse as JSON that might contain URL
        try {
          const parsed = JSON.parse(content);
          if (parsed.url) return parsed.url;
          if (parsed.video_url) return parsed.video_url;
        } catch {
          // Content might be plain text - check for URL pattern
          const urlMatch = content.match(/https?:\/\/[^\s"<>]+/);
          if (urlMatch) return urlMatch[0];
        }
      }

      // Check data.url directly (some API formats)
      if (data.url) return data.url;
      if (data.video_url) return data.video_url;

      console.error('Laozhang.ai Response:', data);
      throw new Error('Could not extract video URL from response');
    } catch (error) {
      console.error('Laozhang.ai Video Error:', error);
      throw error;
    }
  }
}

// ==================== VIDEO GENERATION (Multi-Provider) ====================

export async function generateVideo(
  prompt: string,
  model: string = AI_MODELS.VIDEO.REALISTIC,
  options?: {
    imageUrl?: string;
    image_size?: string;
    duration?: number;
    fps?: number;
    guidance?: number;
  }
): Promise<string> {
  const apiRatio = resolveAspectRatio(options?.image_size || '16:9');

  // Route to Laozhang.ai for Sora 2 / Veo models
  if (LAOZHANG_MODELS.includes(model)) {
    const laozhangKey = getLaozhangKey();
    if (!laozhangKey) {
      throw new Error('Laozhang.ai API key not configured. Please add it in settings for Sora 2 / Veo models.');
    }

    const client = new LaozhangClient(laozhangKey);
    return await client.generateVideo({
      model,
      prompt,
      imageUrl: options?.imageUrl,
      aspectRatio: apiRatio,
      duration: options?.duration || 5,
    });
  }

  // Route to Kie.ai for other models
  const kieKey = getKieKey();
  if (!kieKey) {
    throw new Error('Kie.ai API key not configured. Please add it in settings.');
  }

  const client = new KieClient(kieKey);
  return await client.generateVideo({
    model,
    prompt,
    image_url: options?.imageUrl,
    duration: options?.duration || 5,
    fps: options?.fps || 24,
    guidance_scale: options?.guidance || 7.5,
    aspectRatio: apiRatio,
  });
}

// ==================== GRADIO: Camera Rotation (Qwen) ====================

export async function rotateCharacter(
  imageUrl: string,
  angle: number,
  view: 'front' | 'top' | 'bottom'
): Promise<string> {
  try {
    console.log('🎥 Connecting to Qwen-Image-Edit-Angles...');

    // Set timeout for space sleeping/overload scenarios
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('HuggingFace Space timeout - service may be sleeping or overloaded')), 20000);
    });

    const connectionPromise = Client.connect('linoyts/Qwen-Image-Edit-Angles');

    const client = await Promise.race([connectionPromise, timeoutPromise]);

    // Map view to prompt
    let prompt = '';
    if (view === 'top') {
      prompt = 'top-down view, bird eye view, looking from above, overhead shot';
    } else if (view === 'bottom') {
      prompt = 'low angle view, worm eye view, looking from below, ground level shot';
    } else {
      // Front view with rotation
      if (angle === 0) {
        prompt = 'front view, straight on, eye level';
      } else {
        prompt = `rotate the character ${angle} degrees horizontally while maintaining eye level perspective`;
      }
    }

    console.log('🎬 Predicting with prompt:', prompt);

    const predictionPromise = client.predict('/predict', {
      image: imageUrl,
      prompt: prompt,
    });

    const result = await Promise.race([predictionPromise, timeoutPromise]);

    // Extract result
    const outputData = result.data as unknown[] | undefined;

    if (outputData && outputData[0]) {
      const firstItem = outputData[0];
      if (typeof firstItem === 'object' && firstItem !== null && 'url' in firstItem) {
        return (firstItem as { url: string }).url;
      }
      if (typeof firstItem === 'string') {
        return firstItem;
      }
    }

    throw new Error('Invalid response format from Qwen-Image-Edit');
  } catch (error) {
    console.error('🎥 Qwen-Image-Edit error:', error);

    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('timeout') || error.message.includes('sleeping')) {
        throw new Error('HuggingFace Space is sleeping or busy. Please try again in 30 seconds.');
      }
      throw new Error(`Camera rotation failed: ${error.message}`);
    }

    throw new Error('Camera rotation failed. The AI service might be busy. Please try again.');
  }
}

// ==================== KIE.AI: Upscale (Topaz) ====================

export async function upscaleMedia(
  mediaUrl: string,
  type: 'image' | 'video' = 'image',
  options?: {
    scale?: number; // 2x or 4x
    model?: string;
  }
): Promise<string> {
  const kieKey = getKieKey();
  if (!kieKey) {
    throw new Error('Kie.ai API key not configured. Please add it in settings.');
  }

  const model = options?.model || (type === 'video' ? AI_MODELS.UPSCALE.VIDEO : AI_MODELS.UPSCALE.IMAGE);
  const scale = options?.scale || 2;

  console.log(`🔍 Kie.ai Upscale (${type}):`, model, `${scale}x`);

  const response = await fetch(`${KIE_BASE_URL}/generations/upscale`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${kieKey}`,
    },
    body: JSON.stringify({
      model,
      input_url: mediaUrl,
      scale,
      type,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Kie.ai Upscale API error: ${response.status}`);
  }

  const data = await response.json();

  // Poll for completion if needed
  if (data.status === 'pending' || data.status === 'processing') {
    const client = new KieClient(kieKey);
    return await client['pollForResult'](data.id, type);
  }

  if (data.status === 'completed') {
    const resultUrl = data.result?.url || data.result?.images?.[0]?.url || data.result?.videos?.[0]?.url;
    if (resultUrl) return resultUrl;
  }

  throw new Error(data.error || 'Upscale failed');
}

// ==================== LEGACY: Deprecated but kept for migration ====================

// These can be removed once migration is complete
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function imageToImage(prompt: string, _imageUrl: string): Promise<string> {
  console.warn('imageToImage is deprecated. Use generateImage with appropriate model.');
  return await generateImage(prompt, AI_MODELS.IMAGE.QUALITY);
}
