"use client";

import { useConfigurator } from "@/hooks/useConfigurator";
import type { Material } from "@/types";

interface MaterialSelectorProps {
  materials: Material[];
  loading: boolean;
}

export default function MaterialSelector({
  materials,
  loading,
}: MaterialSelectorProps) {
  const { selectedMaterialId, selectMaterial } = useConfigurator();

  if (loading) {
    return (
      <div className="sidebar-section">
        <label className="block text-sm font-semibold mb-3 text-slate-300">
          Materiali
        </label>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-10 bg-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      <label className="block text-sm font-semibold mb-3 text-slate-300">
        Materiali
      </label>

      <div className="space-y-2">
        {materials.map((material) => {
          const isSelected = selectedMaterialId === material.id;

          return (
            <button
              key={material.id}
              onClick={() => selectMaterial(material.id)}
              className={`w-full px-4 py-2 rounded-lg text-left transition-all ${
                isSelected
                  ? "bg-blue-600 text-white ring-2 ring-blue-400"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              <span className="font-medium">{material.name}</span>
              {material.channels && material.channels.length > 0 && (
                <span className="text-xs opacity-70 ml-2">
                  ({material.channels.length} canali)
                </span>
              )}
            </button>
          );
        })}

        {materials.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">
            Seleziona un modello per vedere i materiali
          </p>
        )}
      </div>
    </div>
  );
}
