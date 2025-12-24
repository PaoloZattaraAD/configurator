"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ConfiguratorState } from "@/types";

export const useConfigurator = create<ConfiguratorState>()(
  devtools(
    persist(
      (set) => ({
        selectedModelId: null,
        selectedMaterialId: null,
        selectedTextureId: null,

        selectModel: (modelId: string) =>
          set(
            {
              selectedModelId: modelId,
              selectedMaterialId: null,
              selectedTextureId: null,
            },
            false,
            "selectModel"
          ),

        selectMaterial: (materialId: string) =>
          set(
            {
              selectedMaterialId: materialId,
              selectedTextureId: null,
            },
            false,
            "selectMaterial"
          ),

        selectTexture: (textureId: string) =>
          set({ selectedTextureId: textureId }, false, "selectTexture"),

        reset: () =>
          set(
            {
              selectedModelId: null,
              selectedMaterialId: null,
              selectedTextureId: null,
            },
            false,
            "reset"
          ),
      }),
      {
        name: "configurator-storage",
        partialize: (state) => ({
          selectedModelId: state.selectedModelId,
        }),
      }
    ),
    { name: "configurator-store" }
  )
);
