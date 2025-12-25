"use client";

import { useState, useEffect, useMemo } from "react";
import type { SketchfabMaterial, SketchfabTexture } from "@/types";

interface BaseColorSelectorProps {
  selectedMaterial: SketchfabMaterial | null;
  textures: SketchfabTexture[];
  onChangeColor: (channelName: string, color: [number, number, number]) => void;
  onChangeTexture: (channelName: string, textureUid: string) => void;
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

const CHANNEL_NAME = "AlbedoPBR";

export default function BaseColorSelector({
  selectedMaterial,
  textures,
  onChangeColor,
  onChangeTexture,
  loading,
}: BaseColorSelectorProps) {
  const [mode, setMode] = useState<"texture" | "color">("texture");

  // Get AlbedoPBR channel info
  const albedoChannel = useMemo(() => {
    return selectedMaterial?.channels?.[CHANNEL_NAME];
  }, [selectedMaterial]);

  // Determine initial mode based on material's AlbedoPBR channel
  useEffect(() => {
    if (albedoChannel?.texture?.uid) {
      setMode("texture");
    } else if (albedoChannel?.color) {
      setMode("color");
    }
  }, [albedoChannel, selectedMaterial?.stateSetID]);

  // Get current texture info
  const currentTextureUid = albedoChannel?.texture?.uid;
  const currentTexture = useMemo(() => {
    if (!currentTextureUid) return null;
    return textures.find((t) => t.uid === currentTextureUid);
  }, [currentTextureUid, textures]);

  // Don't render if no material selected or no AlbedoPBR channel
  if (!selectedMaterial || !albedoChannel) {
    return null;
  }

  if (loading) {
    return (
      <div className="sidebar-section">
        <label className="block text-sm font-semibold mb-3 text-slate-300">
          Base Color
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
        Base Color: {selectedMaterial.name}
      </label>

      {/* Mode toggle */}
      <div className="mb-4">
        <div className="flex rounded-lg overflow-hidden border border-slate-600">
          <button
            onClick={() => setMode("texture")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              mode === "texture"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Texture
          </button>
          <button
            onClick={() => setMode("color")}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              mode === "color"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Colore
          </button>
        </div>
      </div>

      {/* Texture mode */}
      {mode === "texture" && (
        <div>
          {/* Current texture info */}
          {currentTexture && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">Texture corrente:</p>
              <p className="text-sm text-slate-200 truncate">
                {currentTexture.name || currentTextureUid?.substring(0, 12)}
              </p>
            </div>
          )}

          {/* Available textures grid */}
          <p className="text-xs text-slate-400 mb-2">
            Texture disponibili ({textures.length}):
          </p>
          <div className="grid grid-cols-3 gap-2">
            {textures.map((texture) => {
              const isSelected = texture.uid === currentTextureUid;
              const thumbnailUrl = texture.images?.[0]?.url;

              return (
                <button
                  key={texture.uid}
                  onClick={() => onChangeTexture(CHANNEL_NAME, texture.uid)}
                  className={`aspect-square rounded-lg overflow-hidden transition-all relative group ${
                    isSelected
                      ? "ring-2 ring-blue-500"
                      : "hover:ring-2 hover:ring-blue-400 hover:scale-105"
                  }`}
                  title={texture.name || texture.uid}
                >
                  {thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnailUrl}
                      alt={texture.name || "Texture"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                      <span className="text-xs text-slate-400 p-1 text-center truncate">
                        {texture.name?.substring(0, 10) || texture.uid.substring(0, 8)}
                      </span>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Attiva</span>
                    </div>
                  )}
                  <span className="absolute bottom-0 left-0 right-0 text-xs text-white/0 group-hover:text-white/90 bg-black/0 group-hover:bg-black/60 p-1 truncate transition-all">
                    {texture.name || texture.uid.substring(0, 8)}
                  </span>
                </button>
              );
            })}
          </div>

          {textures.length === 0 && (
            <p className="text-sm text-slate-500 mt-2">
              Nessuna texture disponibile nel modello
            </p>
          )}
        </div>
      )}

      {/* Color mode */}
      {mode === "color" && (
        <div>
          <p className="text-xs text-slate-400 mb-2">Seleziona colore:</p>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_OPTIONS.map((opt, index) => (
              <button
                key={index}
                onClick={() => onChangeColor(CHANNEL_NAME, opt.color)}
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
      )}
    </div>
  );
}
