"use client";

import { useState, useCallback, useRef } from "react";
import { viewerController } from "@/lib/viewer/sketchfab-viewer";
import type { Material, Texture, SketchfabAPI } from "@/types";

interface UseViewerAPIOptions {
  autostart?: boolean;
  autospin?: boolean;
}

export function useViewerAPI(options: UseViewerAPIOptions = {}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [textures, setTextures] = useState<Texture[]>([]);
  const apiRef = useRef<SketchfabAPI | null>(null);

  const initViewer = useCallback(
    async (iframe: HTMLIFrameElement, modelId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const api = await viewerController.init(iframe, modelId, {
          autostart: options.autostart ?? true,
          autospin: options.autospin ?? true,
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
    [options.autostart, options.autospin]
  );

  const setMaterial = useCallback(async (material: Material) => {
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

  const setTexture = useCallback(async (textureUid: string, url: string) => {
    if (!viewerController.isInitialized()) {
      console.warn("[Viewer] Not initialized");
      return;
    }

    try {
      await viewerController.setTexture(textureUid, url);
    } catch (err) {
      console.error("[Viewer] Failed to set texture", err);
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
    setTexture,
    refreshMaterials,
    api: apiRef.current,
  };
}
