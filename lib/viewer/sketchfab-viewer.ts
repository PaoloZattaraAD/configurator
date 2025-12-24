// Wrapper per Sketchfab Viewer API

import type { SketchfabAPI, Material, Texture } from "@/types";

interface ViewerOptions {
  autostart?: boolean;
  autospin?: boolean;
  ui_stop?: boolean;
  ui_infos?: boolean;
  ui_controls?: boolean;
  ui_watermark?: boolean;
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

      client.init(modelId, {
        success: (api) => {
          this.api = api;
          api.start();
          resolve(api);
        },
        error: () => {
          reject(new Error("Failed to initialize Sketchfab viewer"));
        },
        autostart: options.autostart ? 1 : 0,
        autospin: options.autospin ? 1 : 0,
        ui_stop: options.ui_stop ? 1 : 0,
      });
    });
  }

  /**
   * Ottieni la lista dei materiali
   */
  async getMaterials(): Promise<Material[]> {
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
  async getTextures(): Promise<Texture[]> {
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
  async setMaterial(material: Material): Promise<void> {
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
   * Cambia la texture di un materiale
   */
  async setTexture(textureUid: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.api) {
        reject(new Error("Viewer not initialized"));
        return;
      }

      this.api.setTexture(textureUid, url, () => {
        resolve();
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
