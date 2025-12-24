// Wrapper per Sketchfab Viewer API

import type { SketchfabAPI, SketchfabMaterial, SketchfabTexture, SketchfabInitOptions } from "@/types";

interface ViewerOptions {
  autostart?: boolean;
  autospin?: number;
  whiteLabel?: boolean;
}

export class SketchfabViewerController {
  private api: SketchfabAPI | null = null;
  private iframe: HTMLIFrameElement | null = null;
  private modelId: string | null = null;

  /**
   * Inizializza il viewer con un modello
   */
  async init(
    iframe: HTMLIFrameElement,
    modelId: string,
    options: ViewerOptions = {}
  ): Promise<SketchfabAPI> {
    return new Promise((resolve, reject) => {
      if (!window.Sketchfab) {
        reject(new Error("Sketchfab API not loaded"));
        return;
      }

      this.iframe = iframe;
      this.modelId = modelId;

      const client = new window.Sketchfab(iframe);

      const initOptions: SketchfabInitOptions = {
        success: (api) => {
          this.api = api;
          api.start();
          resolve(api);
        },
        error: () => {
          reject(new Error("Failed to initialize Sketchfab viewer"));
        },
        autostart: options.autostart !== false ? 1 : 0,
        autospin: options.autospin ?? 0.1,
      };

      // White-label options
      if (options.whiteLabel !== false) {
        initOptions.ui_controls = 0;
        initOptions.ui_infos = 0;
        initOptions.ui_inspector = 0;
        initOptions.ui_stop = 0;
        initOptions.ui_help = 0;
        initOptions.ui_settings = 0;
        initOptions.ui_watermark = 0;
        initOptions.ui_watermark_link = 0;
        initOptions.ui_hint = 0;
        initOptions.ui_annotations = 0;
        initOptions.ui_vr = 0;
        initOptions.ui_fullscreen = 0;
        initOptions.ui_ar = 0;
      }

      client.init(modelId, initOptions);
    });
  }

  /**
   * Ottieni la lista dei materiali
   */
  async getMaterials(): Promise<SketchfabMaterial[]> {
    return new Promise((resolve, reject) => {
      if (!this.api) {
        reject(new Error("Viewer not initialized"));
        return;
      }

      this.api.getMaterialList((err, materials) => {
        if (err) {
          reject(err);
        } else {
          resolve(materials || []);
        }
      });
    });
  }

  /**
   * Ottieni la lista delle texture
   */
  async getTextures(): Promise<SketchfabTexture[]> {
    return new Promise((resolve, reject) => {
      if (!this.api) {
        reject(new Error("Viewer not initialized"));
        return;
      }

      this.api.getTextureList((err, textures) => {
        if (err) {
          reject(err);
        } else {
          resolve(textures || []);
        }
      });
    });
  }

  /**
   * Imposta un materiale
   */
  async setMaterial(material: SketchfabMaterial): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.api) {
        reject(new Error("Viewer not initialized"));
        return;
      }

      this.api.setMaterial(material, () => {
        resolve();
      });
    });
  }

  /**
   * Aggiungi una nuova texture
   */
  async addTexture(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.api) {
        reject(new Error("Viewer not initialized"));
        return;
      }

      this.api.addTexture(url, (err, uid) => {
        if (err) {
          reject(err);
        } else {
          resolve(uid);
        }
      });
    });
  }

  /**
   * Aggiorna una texture esistente
   */
  async updateTexture(url: string, textureUid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.api) {
        reject(new Error("Viewer not initialized"));
        return;
      }

      this.api.updateTexture(url, textureUid, (err, uid) => {
        if (err) {
          reject(err);
        } else {
          resolve(uid || textureUid);
        }
      });
    });
  }

  /**
   * Ferma il viewer
   */
  stop(): void {
    if (this.api) {
      this.api.stop();
    }
  }

  /**
   * Ottieni l'API corrente
   */
  getAPI(): SketchfabAPI | null {
    return this.api;
  }

  /**
   * Check se il viewer è inizializzato
   */
  isInitialized(): boolean {
    return this.api !== null;
  }
}

// Singleton instance
export const viewerController = new SketchfabViewerController();
