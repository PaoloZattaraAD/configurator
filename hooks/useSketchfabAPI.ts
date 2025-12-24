"use client";

import useSWR from "swr";
import type { Model, ModelStructure } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
};

interface ModelsResponse {
  results: Model[];
  ok: boolean;
}

interface StructureResponse extends ModelStructure {
  ok: boolean;
}

export function useSketchfabModels() {
  const { data, error, isLoading, mutate } = useSWR<ModelsResponse>(
    "/api/sketchfab/models",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 ora
    }
  );

  return {
    models: data?.results || [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
}

export function useModelStructure(modelId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<StructureResponse>(
    modelId ? `/api/sketchfab/model/${modelId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1800000, // 30 min
    }
  );

  return {
    structure: data,
    model: data?.model || null,
    materials: data?.materials || [],
    textures: data?.textures || [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
}

export function useSketchfabHealth() {
  const { data, error, isLoading } = useSWR(
    "/api/sketchfab/health",
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000, // Check every minute
    }
  );

  return {
    isHealthy: data?.ok === true,
    status: data?.status,
    loading: isLoading,
    error,
  };
}
