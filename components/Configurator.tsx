"use client";

import { useEffect, useRef } from "react";
import { useConfigurator } from "@/hooks/useConfigurator";
import { useSketchfabModels, useModelStructure } from "@/hooks/useSketchfabAPI";
import Sidebar from "./Sidebar";
import SketchfabViewer from "./Viewer/SketchfabViewer";

export default function Configurator() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { selectedModelId, selectModel } = useConfigurator();
  const { models, loading: loadingModels } = useSketchfabModels();
  const {
    materials,
    textures,
    loading: loadingStructure,
  } = useModelStructure(selectedModelId);

  // Auto-select primo modello
  useEffect(() => {
    if (models.length > 0 && !selectedModelId) {
      selectModel(models[0].uid);
    }
  }, [models, selectedModelId, selectModel]);

  const isLoading = loadingModels || loadingStructure;

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar
        models={models}
        materials={materials}
        textures={textures}
        loading={isLoading}
      />

      <main className="flex-1 flex flex-col relative">
        {selectedModelId ? (
          <SketchfabViewer
            ref={iframeRef}
            modelId={selectedModelId}
            height="h-full"
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
      </main>
    </div>
  );
}
