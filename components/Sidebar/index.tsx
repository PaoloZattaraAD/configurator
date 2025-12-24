"use client";

import { CONFIG } from "@/config/settings";
import Logo from "./Logo";
import ModelSelector from "./ModelSelector";
import MaterialSelector from "./MaterialSelector";
import TextureSelector from "./TextureSelector";
import type { Model, Material, Texture } from "@/types";

interface SidebarProps {
  models: Model[];
  materials: Material[];
  textures?: Texture[];
  loading: boolean;
}

export default function Sidebar({
  models,
  materials,
  textures = [],
  loading,
}: SidebarProps) {
  return (
    <aside
      className={`${CONFIG.ui.sidebarWidth} bg-slate-900 p-6 overflow-y-auto border-r border-slate-700 flex flex-col`}
    >
      <Logo />

      <div className="flex-1 space-y-2">
        <ModelSelector models={models} loading={loading} />
        <MaterialSelector materials={materials} loading={loading} />
        <TextureSelector textures={textures} loading={loading} />
      </div>

      <footer className="mt-auto pt-6 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          Powered by Sketchfab
        </p>
      </footer>
    </aside>
  );
}
