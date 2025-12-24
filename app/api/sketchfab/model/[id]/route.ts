// GET /api/sketchfab/model/[id]
// Fetch struttura completa (materiali + texture)

import { NextResponse } from "next/server";
import { sketchfabClient } from "@/lib/mcp/sketchfab-client";
import { refLogger } from "@/lib/mcp/ref-logger";
import { CONFIG } from "@/config/settings";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const structure = await sketchfabClient.getModelStructure(id);

    if (!structure) {
      return NextResponse.json(
        { error: "Model not found", ok: false },
        { status: 404 }
      );
    }

    // Log su Ref
    await refLogger.logMaterialsFetch(id, structure.materials.length);

    return NextResponse.json(
      { ...structure, ok: true },
      {
        headers: {
          "Cache-Control": `public, max-age=${CONFIG.cache.materials}, stale-while-revalidate=30`,
        },
      }
    );
  } catch (error) {
    console.error("[API] Model structure fetch failed", error);
    return NextResponse.json(
      { error: "Failed to fetch model structure", ok: false },
      { status: 500 }
    );
  }
}
