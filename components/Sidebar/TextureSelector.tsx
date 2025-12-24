"use client";

import { useConfigurator } from "@/hooks/useConfigurator";
import type { Texture } from "@/types";

interface TextureSelectorProps {
  textures: Texture[];
  loading: boolean;
}

export default function TextureSelector({
  textures,
  loading,
}: TextureSelectorProps) {
  const { selectedTextureId, selectTexture } = useConfigurator();

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

  if (textures.length === 0) {
    return null;
  }

  return (
    <div className="sidebar-section">
      <label className="block text-sm font-semibold mb-3 text-slate-300">
        Texture
      </label>

      <div className="grid grid-cols-3 gap-2">
        {textures.map((texture) => {
          const isSelected = selectedTextureId === texture.id;

          return (
            <button
              key={texture.id}
              onClick={() => selectTexture(texture.id)}
              className={`aspect-square rounded-lg overflow-hidden transition-all ${
                isSelected
                  ? "ring-2 ring-blue-400 scale-105"
                  : "hover:ring-2 hover:ring-slate-500"
              }`}
              title={texture.name}
            >
              {texture.url ? (
                <img
                  src={texture.url}
                  alt={texture.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <span className="text-xs text-slate-400 text-center px-1">
                    {texture.name}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
