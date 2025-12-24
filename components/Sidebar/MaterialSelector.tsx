"use client";

import { useState } from "react";
import type { SketchfabMaterial } from "@/types";

interface MaterialSelectorProps {
  materials: SketchfabMaterial[];
  selectedMaterial: SketchfabMaterial | null;
  onSelectMaterial: (material: SketchfabMaterial) => void;
  loading: boolean;
}

export default function MaterialSelector({
  materials,
  selectedMaterial,
  onSelectMaterial,
  loading,
}: MaterialSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="sidebar-section">
        <label className="block text-sm font-semibold mb-3 text-slate-300">
          Livelli / Materiali
        </label>
        <div className="h-10 bg-slate-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="sidebar-section">
        <label className="block text-sm font-semibold mb-3 text-slate-300">
          Livelli / Materiali
        </label>
        <p className="text-sm text-slate-500">
          Caricamento materiali dal modello...
        </p>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      <label className="block text-sm font-semibold mb-3 text-slate-300">
        Livelli / Materiali
      </label>

      {/* Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left flex items-center justify-between transition-colors"
        >
          <span className="truncate text-white font-medium">
            {selectedMaterial?.name || "Seleziona un livello"}
          </span>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 max-h-64 overflow-y-auto">
            {materials.map((material) => (
              <button
                key={material.stateSetID}
                onClick={() => {
                  onSelectMaterial(material);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selectedMaterial?.stateSetID === material.stateSetID
                    ? "bg-blue-600 text-white"
                    : "text-slate-300"
                }`}
              >
                <span className="font-medium">{material.name}</span>
                <span className="text-xs text-slate-400 ml-2">
                  ({Object.keys(material.channels || {}).length} canali)
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected material info */}
      {selectedMaterial && (
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-400 mb-2">Canali disponibili:</p>
          <div className="flex flex-wrap gap-1">
            {Object.keys(selectedMaterial.channels || {}).map((channel) => (
              <span
                key={channel}
                className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
