"use client";

import { CONFIG } from "@/config/settings";
import Logo from "./Logo";
import ModelSelector from "./ModelSelector";
import MaterialSelector from "./MaterialSelector";
import TextureSelector from "./TextureSelector";
import type { Model, SketchfabMaterial, SketchfabTexture } from "@/types";

interface SidebarProps {
  models: Model[];
  materials: SketchfabMaterial[];
  textures: SketchfabTexture[];
  selectedMaterial: SketchfabMaterial | null;
  onSelectMaterial: (material: SketchfabMaterial) => void;
  onChangeTexture: (channelName: string, textureUrl: string) => void;
  loading: boolean;
  viewerReady: boolean;
}

export default function Sidebar({
  models,
  materials,
  textures,
  selectedMaterial,
  onSelectMaterial,
  onChangeTexture,
  loading,
  viewerReady,
}: SidebarProps) {
  return (
    <aside
      className={`${CONFIG.ui.sidebarWidth} bg-slate-900 p-6 overflow-y-auto border-r border-slate-700 flex flex-col`}
    >
      <Logo />

      <div className="flex-1 space-y-2">
        <ModelSelector models={models} loading={loading} />

        <MaterialSelector
          materials={materials}
          selectedMaterial={selectedMaterial}
          onSelectMaterial={onSelectMaterial}
          loading={!viewerReady}
        />

        <TextureSelector
          selectedMaterial={selectedMaterial}
          textures={textures}
          onChangeTexture={onChangeTexture}
          loading={!viewerReady}
        />
      </div>

      <footer className="mt-auto pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Powered by Sketchfab</span>
          {viewerReady && (
            <span className="text-green-500">Pronto</span>
          )}
        </div>
      </footer>
    </aside>
  );
}
