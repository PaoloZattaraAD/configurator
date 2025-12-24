"use client";

import { useState, useCallback, useRef } from "react";
import { viewerController } from "@/lib/viewer/sketchfab-viewer";
import type { SketchfabMaterial, SketchfabTexture, SketchfabAPI } from "@/types";

interface UseViewerAPIOptions {
  autostart?: boolean;
  autospin?: number;
  whiteLabel?: boolean;
}

export function useViewerAPI(options: UseViewerAPIOptions = {}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [materials, setMaterials] = useState<SketchfabMaterial[]>([]);
  const [textures, setTextures] = useState<SketchfabTexture[]>([]);
  const apiRef = useRef<SketchfabAPI | null>(null);

  const initViewer = useCallback(
    async (iframe: HTMLIFrameElement, modelId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const api = await viewerController.init(iframe, modelId, {
          autostart: options.autostart ?? true,
          autospin: options.autospin ?? 0.1,
          whiteLabel: options.whiteLabel ?? true,
        });

        apiRef.current = api;
        setIsInitialized(true);

        // Carica materiali dopo inizializzazione
        setTimeout(async () => {
          try {
            const mats = await viewerController.getMaterials();
            setMaterials(mats);

            const texs = await viewerController.getTextures();
            setTextures(texs);
          } catch (err) {
            console.error("[Viewer] Failed to load materials/textures", err);
          }
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    },
    [options.autostart, options.autospin, options.whiteLabel]
  );

  const setMaterial = useCallback(async (material: SketchfabMaterial) => {
    if (!viewerController.isInitialized()) {
      console.warn("[Viewer] Not initialized");
      return;
    }

    try {
      await viewerController.setMaterial(material);
    } catch (err) {
      console.error("[Viewer] Failed to set material", err);
    }
  }, []);

  const addTexture = useCallback(async (url: string): Promise<string | null> => {
    if (!viewerController.isInitialized()) {
      console.warn("[Viewer] Not initialized");
      return null;
    }

    try {
      return await viewerController.addTexture(url);
    } catch (err) {
      console.error("[Viewer] Failed to add texture", err);
      return null;
    }
  }, []);

  const updateTexture = useCallback(async (url: string, textureUid: string): Promise<string | null> => {
    if (!viewerController.isInitialized()) {
      console.warn("[Viewer] Not initialized");
      return null;
    }

    try {
      return await viewerController.updateTexture(url, textureUid);
    } catch (err) {
      console.error("[Viewer] Failed to update texture", err);
      return null;
    }
  }, []);

  const refreshMaterials = useCallback(async () => {
    if (!viewerController.isInitialized()) {
      return;
    }

    try {
      const mats = await viewerController.getMaterials();
      setMaterials(mats);
    } catch (err) {
      console.error("[Viewer] Failed to refresh materials", err);
    }
  }, []);

  return {
    initViewer,
    isInitialized,
    isLoading,
    error,
    materials,
    textures,
    setMaterial,
    addTexture,
    updateTexture,
    refreshMaterials,
    api: apiRef.current,
  };
}
