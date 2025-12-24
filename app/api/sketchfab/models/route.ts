// GET /api/sketchfab/models
// Wrapper che interroga Sketchfab API

import { NextResponse } from "next/server";
import { sketchfabClient } from "@/lib/mcp/sketchfab-client";
import { refLogger } from "@/lib/mcp/ref-logger";
import { CONFIG } from "@/config/settings";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Fetch da Sketchfab API
    const models = await sketchfabClient.getModels({ limit, offset });

    // Log su Ref
    await refLogger.logModelsFetch(models.length);

    return NextResponse.json(
      { results: models, ok: true },
      {
        headers: {
          "Cache-Control": `public, max-age=${CONFIG.cache.models}, stale-while-revalidate=60`,
        },
      }
    );
  } catch (error) {
    console.error("[API] Models fetch failed", error);
    return NextResponse.json(
      { error: "Failed to fetch models", ok: false },
      { status: 500 }
    );
  }
}
