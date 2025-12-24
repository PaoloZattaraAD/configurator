"use client";

import { useEffect, useState } from "react";
import { useModelStructure } from "./useSketchfabAPI";
import { useViewerAPI } from "./useViewerAPI";
import type { SketchfabMaterial } from "@/types";

interface UseModelMaterialsOptions {
  modelId: string | null;
  useViewerAPI?: boolean;
}

export function useModelMaterials({
  modelId,
  useViewerAPI: useViewer = false,
}: UseModelMaterialsOptions) {
  const [combinedMaterials, setCombinedMaterials] = useState<SketchfabMaterial[]>([]);

  // From API route (limited info)
  const {
    loading: apiLoading,
    error: apiError,
  } = useModelStructure(modelId);

  // From Viewer API (full material info)
  const {
    materials: viewerMaterials,
    isLoading: viewerLoading,
  } = useViewerAPI();

  useEffect(() => {
    if (useViewer && viewerMaterials.length > 0) {
      setCombinedMaterials(viewerMaterials);
    } else {
      setCombinedMaterials([]);
    }
  }, [viewerMaterials, useViewer]);

  return {
    materials: combinedMaterials,
    loading: apiLoading || viewerLoading,
    error: apiError,
    source: useViewer && viewerMaterials.length > 0 ? "viewer" : "api",
  };
}
