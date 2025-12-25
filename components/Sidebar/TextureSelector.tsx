"use client";

import { useState, useMemo } from "react";
import type { SketchfabMaterial, SketchfabTexture } from "@/types";

interface TextureSelectorProps {
  selectedMaterial: SketchfabMaterial | null;
  textures: SketchfabTexture[];
  onChangeTexture: (channelName: string, textureUid: string) => void;
  loading: boolean;
}

export default function TextureSelector({
  selectedMaterial,
  textures,
  onChangeTexture,
  loading,
}: TextureSelectorProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // Get channels that have textures assigned (excluding AlbedoPBR which is handled by BaseColorSelector)
  const textureChannels = useMemo(() => {
    if (!selectedMaterial?.channels) return [];

    return Object.entries(selectedMaterial.channels)
      .filter(([name, channel]) => name !== "AlbedoPBR" && channel.texture?.uid)
      .map(([name, channel]) => ({
        name,
        currentTextureUid: channel.texture?.uid,
      }));
  }, [selectedMaterial]);

  // Auto-select first texture channel when material changes
  useMemo(() => {
    if (textureChannels.length > 0) {
      if (!selectedChannel || !textureChannels.find(c => c.name === selectedChannel)) {
        setSelectedChannel(textureChannels[0].name);
      }
    } else {
      setSelectedChannel(null);
    }
  }, [textureChannels, selectedChannel]);

  // Get texture info by UID
  const getTextureInfo = (uid: string | undefined) => {
    if (!uid) return null;
    return textures.find((t) => t.uid === uid);
  };

  // Get current texture for selected channel
  const currentTextureUid = useMemo(() => {
    if (!selectedChannel) return null;
    const channel = textureChannels.find(c => c.name === selectedChannel);
    return channel?.currentTextureUid;
  }, [selectedChannel, textureChannels]);

  // Don't render if no material selected or no texture channels
  if (!selectedMaterial || textureChannels.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="sidebar-section">
        <label className="block text-sm font-semibold mb-3 text-slate-300">
          Texture
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square bg-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const currentTexture = getTextureInfo(currentTextureUid);

  return (
    <div className="sidebar-section">
      <label className="block text-sm font-semibold mb-3 text-slate-300">
        Texture: {selectedMaterial.name}
      </label>

      {/* Channel selector */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">Canale texture:</p>
        <select
          value={selectedChannel || ""}
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {textureChannels.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

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
      <div>
        <p className="text-xs text-slate-400 mb-2">
          Texture disponibili ({textures.length}):
        </p>
        {/*
          Versione con altezza limitata (scrollabile):
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
        */}
        <div className="grid grid-cols-3 gap-2">
          {textures.map((texture) => {
            const isSelected = texture.uid === currentTextureUid;
            const thumbnailUrl = texture.images?.[0]?.url;

            return (
              <button
                key={texture.uid}
                onClick={() => {
                  if (selectedChannel) {
                    onChangeTexture(selectedChannel, texture.uid);
                  }
                }}
                disabled={!selectedChannel}
                className={`aspect-square rounded-lg overflow-hidden transition-all relative group ${
                  isSelected
                    ? "ring-2 ring-blue-500"
                    : "hover:ring-2 hover:ring-blue-400 hover:scale-105"
                } ${!selectedChannel ? "opacity-50 cursor-not-allowed" : ""}`}
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
      </div>

      {textures.length === 0 && (
        <p className="text-sm text-slate-500 mt-2">
          Nessuna texture disponibile nel modello
        </p>
      )}
    </div>
  );
}
