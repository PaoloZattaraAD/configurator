// Client MCP Sketchfab
// Usa il server MCP sketchfab per comunicare con API Sketchfab

import { CONFIG } from "@/config/settings";
import type { Model, ModelStructure, Material, Texture } from "@/types";

export class SketchfabMCPClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = CONFIG.sketchfab.apiKey || "";
    this.baseUrl = CONFIG.sketchfab.baseUrl;
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Token ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Fetch lista modelli dell'account
   */
  async getModels(options?: {
    limit?: number;
    offset?: number;
  }): Promise<Model[]> {
    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    try {
      const response = await fetch(
        `${this.baseUrl}/me/models?count=${limit}&offset=${offset}`,
        {
          headers: this.getHeaders(),
          next: { revalidate: CONFIG.cache.models },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("[SketchfabMCP] getModels error:", error);
      return [];
    }
  }

  /**
   * Fetch singolo modello con metadata
   */
  async getModel(modelId: string): Promise<Model | null> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}`, {
        headers: this.getHeaders(),
        next: { revalidate: CONFIG.cache.models },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch model: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[SketchfabMCP] getModel error:", error);
      return null;
    }
  }

  /**
   * Query intelligente: fetch materiali + texture per modello
   * Nota: I materiali richiedono la Viewer API per accesso completo
   */
  async getModelStructure(modelId: string): Promise<ModelStructure | null> {
    try {
      const model = await this.getModel(modelId);

      if (!model) {
        return null;
      }

      // I materiali effettivi vengono caricati dalla Viewer API
      // Qui restituiamo una struttura base
      const materials: Material[] = [];
      const textures: Texture[] = [];

      return {
        model,
        materials,
        textures,
      };
    } catch (error) {
      console.error("[SketchfabMCP] getModelStructure error:", error);
      return null;
    }
  }

  /**
   * Search modelli pubblici
   */
  async searchModels(
    query: string,
    options?: { limit?: number }
  ): Promise<Model[]> {
    const limit = options?.limit || 24;

    try {
      const response = await fetch(
        `${this.baseUrl}/search?type=models&q=${encodeURIComponent(query)}&count=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search models: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("[SketchfabMCP] searchModels error:", error);
      return [];
    }
  }

  /**
   * Health check API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const sketchfabClient = new SketchfabMCPClient();
