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
  getMaterialList: (callback: (err: Error | null, materials: Material[]) => void) => void;
  setMaterial: (material: Material, callback?: () => void) => void;
  getTextureList: (callback: (err: Error | null, textures: Texture[]) => void) => void;
  setTexture: (textureUid: string, url: string, callback?: () => void) => void;
}

declare global {
  interface Window {
    Sketchfab?: new (iframe: HTMLIFrameElement) => {
      init: (
        modelId: string,
        options: {
          success: (api: SketchfabAPI) => void;
          error: () => void;
          autostart?: number;
          autospin?: number;
          ui_stop?: number;
        }
      ) => void;
    };
  }
}
