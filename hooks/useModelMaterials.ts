"use client";

import { useEffect, useState } from "react";
import { useModelStructure } from "./useSketchfabAPI";
import { useViewerAPI } from "./useViewerAPI";
import type { Material } from "@/types";

interface UseModelMaterialsOptions {
  modelId: string | null;
  useViewerAPI?: boolean;
}

export function useModelMaterials({
  modelId,
  useViewerAPI: useViewer = false,
}: UseModelMaterialsOptions) {
  const [combinedMaterials, setCombinedMaterials] = useState<Material[]>([]);

  // From API route
  const {
    materials: apiMaterials,
    loading: apiLoading,
    error: apiError,
  } = useModelStructure(modelId);

  // From Viewer API
  const {
    materials: viewerMaterials,
    isLoading: viewerLoading,
  } = useViewerAPI();

  useEffect(() => {
    if (useViewer && viewerMaterials.length > 0) {
      setCombinedMaterials(viewerMaterials);
    } else if (apiMaterials.length > 0) {
      setCombinedMaterials(apiMaterials);
    } else {
      setCombinedMaterials([]);
    }
  }, [apiMaterials, viewerMaterials, useViewer]);

  return {
    materials: combinedMaterials,
    loading: apiLoading || viewerLoading,
    error: apiError,
    source: useViewer && viewerMaterials.length > 0 ? "viewer" : "api",
  };
}
