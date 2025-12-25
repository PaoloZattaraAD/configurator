"use client";

import { useState, useMemo } from "react";
import type { SketchfabMaterial } from "@/types";

interface ColorSelectorProps {
  selectedMaterial: SketchfabMaterial | null;
  onChangeColor: (channelName: string, color: [number, number, number]) => void;
  loading: boolean;
}

// Colori disponibili (RGB normalizzato 0-1)
const COLOR_OPTIONS = [
  { name: "Nero", color: [0.1, 0.1, 0.1] as [number, number, number], hex: "#1a1a1a" },
  { name: "Marrone", color: [0.36, 0.25, 0.2] as [number, number, number], hex: "#5c4033" },
  { name: "Grigio", color: [0.42, 0.45, 0.5] as [number, number, number], hex: "#6b7280" },
  { name: "Blu", color: [0.12, 0.25, 0.69] as [number, number, number], hex: "#1e40af" },
  { name: "Rosso", color: [0.7, 0.15, 0.15] as [number, number, number], hex: "#b32626" },
  { name: "Verde", color: [0.15, 0.5, 0.25] as [number, number, number], hex: "#268040" },
  { name: "Beige", color: [0.83, 0.65, 0.46] as [number, number, number], hex: "#d4a574" },
  { name: "Bianco", color: [0.9, 0.9, 0.9] as [number, number, number], hex: "#e6e6e6" },
];

// Canali che supportano il cambio colore (AlbedoPBR is handled by BaseColorSelector)
const COLOR_CHANNELS = ["DiffusePBR", "SpecularColor", "DiffuseColor"];

export default function ColorSelector({
  selectedMaterial,
  onChangeColor,
  loading,
}: ColorSelectorProps) {
  const [selectedChannel, setSelectedChannel] = useState<string>("AlbedoPBR");

  // Get available color channels (channels without textures)
  const availableColorChannels = useMemo(() => {
    if (!selectedMaterial?.channels) return [];

    return COLOR_CHANNELS.filter(channelName => {
      const channel = selectedMaterial.channels[channelName];
      if (!channel) return false;
      // Only show if channel does NOT have a texture assigned
      return !channel.texture?.uid;
    });
  }, [selectedMaterial]);

  // Auto-select first available channel when material changes
  useMemo(() => {
    if (availableColorChannels.length > 0 && !availableColorChannels.includes(selectedChannel)) {
      setSelectedChannel(availableColorChannels[0]);
    }
  }, [availableColorChannels, selectedChannel]);

  // Don't render if no material selected or no color channels available
  if (!selectedMaterial || availableColorChannels.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="sidebar-section">
        <label className="block text-sm font-semibold mb-3 text-slate-300">
          Colori
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square bg-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      <label className="block text-sm font-semibold mb-3 text-slate-300">
        Colore: {selectedMaterial.name}
      </label>

      {/* Channel selector */}
      {availableColorChannels.length > 1 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">Canale colore:</p>
          <div className="flex flex-wrap gap-2">
            {availableColorChannels.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedChannel(name)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedChannel === name
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color picker */}
      <div>
        <p className="text-xs text-slate-400 mb-2">Seleziona colore ({selectedChannel}):</p>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_OPTIONS.map((opt, index) => (
            <button
              key={index}
              onClick={() => onChangeColor(selectedChannel, opt.color)}
              className="aspect-square rounded-lg overflow-hidden transition-all hover:ring-2 hover:ring-blue-400 hover:scale-105 relative group"
              title={opt.name}
            >
              <div
                className="w-full h-full"
                style={{ backgroundColor: opt.hex }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs text-white/0 group-hover:text-white/90 bg-black/0 group-hover:bg-black/40 transition-all">
                {opt.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
