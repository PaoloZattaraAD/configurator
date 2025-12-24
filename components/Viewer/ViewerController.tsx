"use client";

import { useViewerAPI } from "@/hooks/useViewerAPI";

interface ViewerControllerProps {
  modelId: string | null;
}

export default function ViewerController({ modelId }: ViewerControllerProps) {
  const { isInitialized, isLoading, materials, refreshMaterials } = useViewerAPI();

  if (!modelId) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur rounded-lg p-4 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            Status:{" "}
            <span
              className={isInitialized ? "text-green-400" : "text-yellow-400"}
            >
              {isInitialized ? "Pronto" : isLoading ? "Caricamento..." : "Non inizializzato"}
            </span>
          </span>

          {isInitialized && (
            <span className="text-sm text-slate-400">
              Materiali: <span className="text-white">{materials.length}</span>
            </span>
          )}
        </div>

        {isInitialized && (
          <button
            onClick={refreshMaterials}
            className="btn-secondary text-sm"
            disabled={isLoading}
          >
            Aggiorna Materiali
          </button>
        )}
      </div>
    </div>
  );
}
