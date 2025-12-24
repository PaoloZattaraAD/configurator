"use client";

import { useConfigurator } from "@/hooks/useConfigurator";
import { getModelThumbnail } from "@/lib/utils";
import type { Model } from "@/types";

interface ModelSelectorProps {
  models: Model[];
  loading: boolean;
}

export default function ModelSelector({ models, loading }: ModelSelectorProps) {
  const { selectedModelId, selectModel } = useConfigurator();

  if (loading) {
    return (
      <div className="sidebar-section">
        <label className="block text-sm font-semibold mb-3 text-slate-300">
          Modello
        </label>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      <label className="block text-sm font-semibold mb-3 text-slate-300">
        Modello
      </label>

      <div className="space-y-2">
        {models.map((model) => {
          const thumbnail = getModelThumbnail(model);
          const isSelected = selectedModelId === model.uid;

          return (
            <button
              key={model.uid}
              onClick={() => selectModel(model.uid)}
              className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                isSelected
                  ? "bg-blue-600 text-white ring-2 ring-blue-400"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={model.name}
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
              )}
              <span className="truncate font-medium">{model.name}</span>
            </button>
          );
        })}

        {models.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">
            Nessun modello trovato
          </p>
        )}
      </div>
    </div>
  );
}
