"use client";

import { forwardRef, useEffect, useState } from "react";
import { getSketchfabEmbedUrl } from "@/lib/utils";

interface SketchfabViewerProps {
  modelId: string;
  height?: string;
  autostart?: boolean;
  autospin?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const SketchfabViewer = forwardRef<HTMLIFrameElement, SketchfabViewerProps>(
  (
    {
      modelId,
      height = "h-full",
      autostart = true,
      autospin = true,
      onLoad,
      onError,
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const embedUrl = getSketchfabEmbedUrl(modelId, { autostart, autospin });

    useEffect(() => {
      setIsLoading(true);
      setError(null);
    }, [modelId]);

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      const err = new Error("Failed to load Sketchfab viewer");
      setError(err.message);
      setIsLoading(false);
      onError?.(err);
    };

    return (
      <div className={`relative w-full ${height} bg-slate-950`}>
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400">Caricamento modello 3D...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 z-10">
            <div className="text-center">
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                }}
                className="btn-primary"
              >
                Riprova
              </button>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          ref={ref}
          title="Sketchfab 3D Viewer"
          className={`w-full ${height} border-0`}
          allow="autoplay; fullscreen; xr-spatial-tracking; clipboard-write"
          src={embedUrl}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    );
  }
);

SketchfabViewer.displayName = "SketchfabViewer";

export default SketchfabViewer;
