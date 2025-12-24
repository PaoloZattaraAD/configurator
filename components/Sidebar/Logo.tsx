"use client";

import { CONFIG } from "@/config/settings";

export default function Logo() {
  return (
    <div className="mb-8">
      <img
        src={CONFIG.ui.logo}
        alt="Logo"
        className="h-12 object-contain"
        onError={(e) => {
          // Fallback to text if image fails
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <h1 className="text-xl font-bold text-white mt-2">3D Configurator</h1>
    </div>
  );
}
