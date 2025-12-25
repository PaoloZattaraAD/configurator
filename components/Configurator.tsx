"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useConfigurator } from "@/hooks/useConfigurator";
import { useSketchfabModels } from "@/hooks/useSketchfabAPI";
import Sidebar from "./Sidebar";
import SketchfabViewer, { type SketchfabViewerHandle } from "./Viewer/SketchfabViewer";
import type { SketchfabAPI, SketchfabMaterial, SketchfabTexture } from "@/types";

export default function Configurator() {
  const viewerRef = useRef<SketchfabViewerHandle>(null);
  const { selectedModelId, selectModel } = useConfigurator();
  const { models, loading: loadingModels } = useSketchfabModels();

  // Viewer state
  const [viewerReady, setViewerReady] = useState(false);
  const [materials, setMaterials] = useState<SketchfabMaterial[]>([]);
  const [textures, setTextures] = useState<SketchfabTexture[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<SketchfabMaterial | null>(null);
  const [apiRef, setApiRef] = useState<SketchfabAPI | null>(null);

  // Auto-select primo modello
  useEffect(() => {
    if (models.length > 0 && !selectedModelId) {
      selectModel(models[0].uid);
    }
  }, [models, selectedModelId, selectModel]);

  // Reset state when model changes
  useEffect(() => {
    setViewerReady(false);
    setMaterials([]);
    setTextures([]);
    setSelectedMaterial(null);
  }, [selectedModelId]);

  // Handlers for viewer events
  const handleViewerReady = useCallback((api: SketchfabAPI) => {
    console.log("[Configurator] Viewer ready");
    setApiRef(api);
    setViewerReady(true);
  }, []);

  const handleMaterialsLoaded = useCallback((mats: SketchfabMaterial[]) => {
    console.log("[Configurator] Materials loaded:", mats.map(m => m.name));
    setMaterials(mats);
    // Auto-select first material
    if (mats.length > 0) {
      setSelectedMaterial(mats[0]);
    }
  }, []);

  const handleTexturesLoaded = useCallback((texs: SketchfabTexture[]) => {
    console.log("[Configurator] Textures loaded:", texs.length);
    setTextures(texs);
  }, []);

  const handleSelectMaterial = useCallback((material: SketchfabMaterial) => {
    console.log("[Configurator] Selected material:", material.name);
    setSelectedMaterial(material);
  }, []);

  // Change color for selected material channel
  const handleChangeColor = useCallback((channelName: string, color: [number, number, number]) => {
    if (!selectedMaterial || !apiRef) {
      console.warn("[Configurator] Cannot change color: no material selected or API not ready");
      return;
    }

    console.log("[Configurator] Changing color:", channelName, color);

    try {
      // Update material with new color
      const updatedMaterial: SketchfabMaterial = {
        ...selectedMaterial,
        channels: {
          ...selectedMaterial.channels,
          [channelName]: {
            ...selectedMaterial.channels[channelName],
            color: color,
          },
        },
      };

      // Apply material
      apiRef.setMaterial(updatedMaterial, () => {
        console.log("[Configurator] Material color updated");
        setSelectedMaterial(updatedMaterial);

        // Update materials list
        setMaterials(prev => prev.map(m =>
          m.stateSetID === updatedMaterial.stateSetID ? updatedMaterial : m
        ));
      });
    } catch (error) {
      console.error("[Configurator] Failed to change color:", error);
    }
  }, [selectedMaterial, apiRef]);

  // Change texture for selected material channel
  const handleChangeTexture = useCallback((channelName: string, textureUid: string) => {
    if (!selectedMaterial || !apiRef) {
      console.warn("[Configurator] Cannot change texture: no material selected or API not ready");
      return;
    }

    console.log("[Configurator] Changing texture:", channelName, textureUid);

    try {
      // Update material with new texture UID
      const updatedMaterial: SketchfabMaterial = {
        ...selectedMaterial,
        channels: {
          ...selectedMaterial.channels,
          [channelName]: {
            ...selectedMaterial.channels[channelName],
            texture: {
              ...selectedMaterial.channels[channelName]?.texture,
              uid: textureUid,
            },
          },
        },
      };

      // Apply material
      apiRef.setMaterial(updatedMaterial, () => {
        console.log("[Configurator] Material texture updated");
        setSelectedMaterial(updatedMaterial);

        // Update materials list
        setMaterials(prev => prev.map(m =>
          m.stateSetID === updatedMaterial.stateSetID ? updatedMaterial : m
        ));
      });
    } catch (error) {
      console.error("[Configurator] Failed to change texture:", error);
    }
  }, [selectedMaterial, apiRef]);

  const handleViewerError = useCallback((error: Error) => {
    console.error("[Configurator] Viewer error:", error);
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar
        models={models}
        materials={materials}
        textures={textures}
        selectedMaterial={selectedMaterial}
        onSelectMaterial={handleSelectMaterial}
        onChangeColor={handleChangeColor}
        onChangeTexture={handleChangeTexture}
        loading={loadingModels}
        viewerReady={viewerReady}
      />

      <main className="flex-1 flex flex-col relative">
        {selectedModelId ? (
          <SketchfabViewer
            ref={viewerRef}
            modelId={selectedModelId}
            height="h-full"
            autospin={0.1} // Very slow rotation
            onReady={handleViewerReady}
            onMaterialsLoaded={handleMaterialsLoaded}
            onTexturesLoaded={handleTexturesLoaded}
            onError={handleViewerError}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-400 mb-2">
                Nessun modello selezionato
              </h2>
              <p className="text-slate-500">
                {loadingModels
                  ? "Caricamento modelli..."
                  : "Seleziona un modello dalla sidebar"}
              </p>
            </div>
          </div>
        )}

        {/* Debug info (can be removed in production) */}
        {viewerReady && (
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur rounded-lg p-3 text-xs text-slate-400">
            <div>Materiali: {materials.length}</div>
            <div>Texture: {textures.length}</div>
            <div>Selezionato: {selectedMaterial?.name || "Nessuno"}</div>
          </div>
        )}
      </main>
    </div>
  );
}
