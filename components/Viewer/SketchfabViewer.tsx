"use client";

import { forwardRef, useEffect, useRef, useCallback, useImperativeHandle } from "react";
import type { SketchfabAPI, SketchfabMaterial, SketchfabTexture } from "@/types";

interface SketchfabViewerProps {
  modelId: string;
  height?: string;
  autospin?: number; // 0 = off, 0.1 = slow, 1 = normal
  onReady?: (api: SketchfabAPI) => void;
  onMaterialsLoaded?: (materials: SketchfabMaterial[]) => void;
  onTexturesLoaded?: (textures: SketchfabTexture[]) => void;
  onError?: (error: Error) => void;
}

export interface SketchfabViewerHandle {
  api: SketchfabAPI | null;
  getMaterials: () => Promise<SketchfabMaterial[]>;
  getTextures: () => Promise<SketchfabTexture[]>;
  setMaterial: (material: SketchfabMaterial) => Promise<void>;
  addTexture: (url: string) => Promise<string>;
  updateTexture: (url: string, textureUid: string) => Promise<string>;
}

const SketchfabViewer = forwardRef<SketchfabViewerHandle, SketchfabViewerProps>(
  (
    {
      modelId,
      height = "h-full",
      autospin = 0.1,
      onReady,
      onMaterialsLoaded,
      onTexturesLoaded,
      onError,
    },
    ref
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const apiRef = useRef<SketchfabAPI | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientRef = useRef<any>(null);

    // Expose API methods via ref
    useImperativeHandle(ref, () => ({
      api: apiRef.current,
      getMaterials: () => {
        return new Promise((resolve, reject) => {
          if (!apiRef.current) {
            reject(new Error("API not initialized"));
            return;
          }
          apiRef.current.getMaterialList((err, materials) => {
            if (err) reject(err);
            else resolve(materials);
          });
        });
      },
      getTextures: () => {
        return new Promise((resolve, reject) => {
          if (!apiRef.current) {
            reject(new Error("API not initialized"));
            return;
          }
          apiRef.current.getTextureList((err, textures) => {
            if (err) reject(err);
            else resolve(textures);
          });
        });
      },
      setMaterial: (material: SketchfabMaterial) => {
        return new Promise((resolve, reject) => {
          if (!apiRef.current) {
            reject(new Error("API not initialized"));
            return;
          }
          apiRef.current.setMaterial(material, () => resolve());
        });
      },
      addTexture: (url: string) => {
        return new Promise((resolve, reject) => {
          if (!apiRef.current) {
            reject(new Error("API not initialized"));
            return;
          }
          apiRef.current.addTexture(url, (err, uid) => {
            if (err) reject(err);
            else resolve(uid);
          });
        });
      },
      updateTexture: (url: string, textureUid: string) => {
        return new Promise((resolve, reject) => {
          if (!apiRef.current) {
            reject(new Error("API not initialized"));
            return;
          }
          apiRef.current.updateTexture(url, textureUid, (err, uid) => {
            if (err) reject(err);
            else resolve(uid || textureUid);
          });
        });
      },
    }));

    const initViewer = useCallback(() => {
      if (!iframeRef.current || !window.Sketchfab) {
        console.error("[SketchfabViewer] iframe or Sketchfab API not available");
        return;
      }

      // Clean up previous client
      if (apiRef.current) {
        apiRef.current.stop();
        apiRef.current = null;
      }

      const client = new window.Sketchfab(iframeRef.current);
      clientRef.current = client;

      client.init(modelId, {
        success: (api) => {
          apiRef.current = api;
          api.start();

          // Wait for viewer to be ready, then load materials
          api.addEventListener("viewerready", () => {
            console.log("[SketchfabViewer] Viewer ready");
            onReady?.(api);

            // Load materials
            api.getMaterialList((err, materials) => {
              if (!err && materials) {
                console.log("[SketchfabViewer] Materials loaded:", materials.length);
                onMaterialsLoaded?.(materials);
              }
            });

            // Load textures
            api.getTextureList((err, textures) => {
              if (!err && textures) {
                console.log("[SketchfabViewer] Textures loaded:", textures.length);
                onTexturesLoaded?.(textures);
              }
            });
          });
        },
        error: () => {
          const error = new Error("Failed to initialize Sketchfab viewer");
          console.error("[SketchfabViewer]", error);
          onError?.(error);
        },
        // White-label options
        autostart: 1,
        autospin: autospin,
        ui_controls: 0,
        ui_infos: 0,
        ui_inspector: 0,
        ui_stop: 0,
        ui_help: 0,
        ui_settings: 0,
        ui_watermark: 0,
        ui_watermark_link: 0,
        ui_hint: 0,
        ui_annotations: 0,
        ui_vr: 0,
        ui_fullscreen: 0,
        ui_ar: 0,
        transparent: 0,
        preload: 1,
      });
    }, [modelId, autospin, onReady, onMaterialsLoaded, onTexturesLoaded, onError]);

    // Initialize viewer when modelId changes
    useEffect(() => {
      // Wait for Sketchfab API to be available
      const checkAndInit = () => {
        if (window.Sketchfab) {
          initViewer();
        } else {
          // Retry after a short delay
          setTimeout(checkAndInit, 100);
        }
      };

      checkAndInit();

      return () => {
        if (apiRef.current) {
          apiRef.current.stop();
          apiRef.current = null;
        }
      };
    }, [modelId, initViewer]);

    return (
      <div className={`relative w-full ${height} bg-slate-950`}>
        <iframe
          ref={iframeRef}
          title="Sketchfab 3D Viewer"
          className={`w-full ${height} border-0`}
          allow="autoplay; fullscreen; xr-spatial-tracking; clipboard-write"
        />
      </div>
    );
  }
);

SketchfabViewer.displayName = "SketchfabViewer";

export default SketchfabViewer;
