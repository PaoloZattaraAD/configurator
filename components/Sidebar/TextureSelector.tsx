"use client";

import { useState, useMemo } from "react";
import type { SketchfabMaterial, SketchfabTexture } from "@/types";

interface TextureSelectorProps {
  selectedMaterial: SketchfabMaterial | null;
  textures: SketchfabTexture[];
  onChangeTexture: (channelName: string, textureUid: string) => void;
  loading: boolean;
}

// Lista di texture di esempio che possono essere applicate
const SAMPLE_TEXTURES = [
  { name: "Pelle Nera", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop", color: "#1a1a1a" },
  { name: "Pelle Marrone", url: "https://images.unsplash.com/photo-1558618047-f4b511ee798d?w=512&h=512&fit=crop", color: "#5c4033" },
  { name: "Tessuto Grigio", url: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=512&h=512&fit=crop", color: "#6b7280" },
  { name: "Velluto Blu", url: "https://images.unsplash.com/photo-1558171814-2f4e0f3b8c7f?w=512&h=512&fit=crop", color: "#1e40af" },
  { name: "Legno Chiaro", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=512&h=512&fit=crop", color: "#d4a574" },
  { name: "Legno Scuro", url: "https://images.unsplash.com/photo-1558618047-f4b511ee798d?w=512&h=512&fit=crop", color: "#4a3728" },
];

export default function TextureSelector({
  selectedMaterial,
  textures,
  onChangeTexture,
  loading,
}: TextureSelectorProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // Get channels that have textures
  const textureChannels = useMemo(() => {
    if (!selectedMaterial?.channels) return [];

    return Object.entries(selectedMaterial.channels)
      .filter(([, channel]) => channel.texture?.uid)
      .map(([name, channel]) => ({
        name,
        textureUid: channel.texture?.uid,
      }));
  }, [selectedMaterial]);

  // Get texture info for a UID
  const getTextureInfo = (uid: string | undefined) => {
    if (!uid) return null;
    return textures.find((t) => t.uid === uid);
  };

  if (!selectedMaterial) {
    return null;
  }

  if (loading) {
    return (
      <div className="sidebar-section">
        <label className="block text-sm font-semibold mb-3 text-slate-300">
          Texture
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
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
        Texture per: {selectedMaterial.name}
      </label>

      {/* Channel selector if multiple texture channels */}
      {textureChannels.length > 1 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">Canale texture:</p>
          <div className="flex flex-wrap gap-2">
            {textureChannels.map(({ name }) => (
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

      {/* Current texture info */}
      {textureChannels.length > 0 && (
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-400 mb-2">Texture correnti:</p>
          {textureChannels.map(({ name, textureUid }) => {
            const texInfo = getTextureInfo(textureUid);
            return (
              <div key={name} className="flex items-center gap-2 text-sm text-slate-300 mb-1">
                <span className="text-slate-500">{name}:</span>
                <span className="truncate">{texInfo?.name || textureUid?.substring(0, 8) || "N/A"}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Available textures/colors to apply */}
      <div>
        <p className="text-xs text-slate-400 mb-2">Cambia texture:</p>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_TEXTURES.map((tex, index) => (
            <button
              key={index}
              onClick={() => {
                const channel = selectedChannel || textureChannels[0]?.name || "AlbedoPBR";
                onChangeTexture(channel, tex.url);
              }}
              className="aspect-square rounded-lg overflow-hidden transition-all hover:ring-2 hover:ring-blue-400 hover:scale-105"
              title={tex.name}
            >
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: tex.color }}
              >
                <span className="text-xs text-white/70 text-center px-1">
                  {tex.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {textureChannels.length === 0 && (
        <p className="text-sm text-slate-500 mt-2">
          Questo materiale non ha texture modificabili
        </p>
      )}
    </div>
  );
}
