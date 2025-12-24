// Types per il 3D Configurator

export interface Model {
  uid: string;
  name: string;
  description?: string;
  thumbnail?: {
    url: string;
  };
  thumbnails?: {
    images: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  viewerUrl?: string;
  embedUrl?: string;
  isDownloadable?: boolean;
  publishedAt?: string;
  viewCount?: number;
  likeCount?: number;
}

// Sketchfab Material structure (from Viewer API)
export interface SketchfabMaterial {
  id: string;
  name: string;
  stateSetID: number;
  channels: {
    [channelName: string]: SketchfabChannel;
  };
}

export interface SketchfabChannel {
  enable?: boolean;
  factor?: number;
  color?: [number, number, number];
  colorFactor?: number;
  texture?: SketchfabTextureRef;
  UVTransforms?: {
    offset: [number, number];
    rotation: number;
    scale: [number, number];
  };
}

export interface SketchfabTextureRef {
  uid: string;
  magFilter?: string;
  minFilter?: string;
  wrapS?: string;
  wrapT?: string;
  texCoordUnit?: number;
  internalFormat?: string;
}

// Sketchfab Texture structure (from Viewer API)
export interface SketchfabTexture {
  uid: string;
  name?: string;
  images?: Array<{
    uid: string;
    url: string;
    width: number;
    height: number;
  }>;
}

// Legacy Material interface (for backwards compatibility)
export interface Material {
  id: string;
  name: string;
  channels?: MaterialChannel[];
}

export interface MaterialChannel {
  name: string;
  value?: number[];
  texture?: Texture;
  factor?: number;
  enable?: boolean;
}

export interface Texture {
  id: string;
  name: string;
  type?: "diffuse" | "normal" | "specular" | "roughness" | "metalness" | "ao";
  url?: string;
  width?: number;
  height?: number;
  uid?: string;
}

export interface ModelsResponse {
  results: Model[];
  cursors?: {
    next?: string;
    previous?: string;
  };
  next?: string;
}

export interface ModelStructure {
  model: Model;
  materials: Material[];
  textures: Texture[];
}

export interface APIError {
  error: string;
  status?: number;
  ok: false;
}

export interface APISuccess<T> {
  data: T;
  ok: true;
}

export type APIResponse<T> = APISuccess<T> | APIError;

// Configurator State
export interface ConfiguratorState {
  selectedModelId: string | null;
  selectedMaterialId: string | null;
  selectedTextureId: string | null;
  selectModel: (modelId: string) => void;
  selectMaterial: (materialId: string) => void;
  selectTexture: (textureId: string) => void;
  reset: () => void;
}

// Sketchfab Viewer API Types
export interface SketchfabAPI {
  start: () => void;
  stop: () => void;
  // Materials
  getMaterialList: (callback: (err: Error | null, materials: SketchfabMaterial[]) => void) => void;
  setMaterial: (material: SketchfabMaterial, callback?: () => void) => void;
  // Textures
  getTextureList: (callback: (err: Error | null, textures: SketchfabTexture[]) => void) => void;
  addTexture: (url: string, callback: (err: Error | null, textureUid: string) => void) => void;
  updateTexture: (url: string, textureUid: string, callback?: (err: Error | null, textureUid: string) => void) => void;
  // Camera
  setCameraLookAt: (position: number[], target: number[], duration?: number, callback?: () => void) => void;
  getCameraLookAt: (callback: (err: Error | null, camera: { position: number[]; target: number[] }) => void) => void;
  // Scene graph
  getNodeMap: (callback: (err: Error | null, nodes: Record<string, unknown>) => void) => void;
  show: (instanceID: number, callback?: () => void) => void;
  hide: (instanceID: number, callback?: () => void) => void;
  // Events
  addEventListener: (event: string, callback: (...args: unknown[]) => void) => void;
  removeEventListener: (event: string, callback: (...args: unknown[]) => void) => void;
}

// Sketchfab Client Options
export interface SketchfabInitOptions {
  success: (api: SketchfabAPI) => void;
  error: () => void;
  autostart?: number;
  autospin?: number;
  ui_controls?: number;
  ui_infos?: number;
  ui_inspector?: number;
  ui_stop?: number;
  ui_help?: number;
  ui_settings?: number;
  ui_watermark?: number;
  ui_watermark_link?: number;
  ui_hint?: number;
  ui_annotations?: number;
  ui_vr?: number;
  ui_fullscreen?: number;
  ui_ar?: number;
  transparent?: number;
  preload?: number;
}

declare global {
  interface Window {
    Sketchfab?: new (iframe: HTMLIFrameElement) => {
      init: (modelId: string, options: SketchfabInitOptions) => void;
    };
  }
}
