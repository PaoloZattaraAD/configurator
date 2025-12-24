// GET /api/sketchfab/health
// Health check per Sketchfab API

import { NextResponse } from "next/server";
import { sketchfabClient } from "@/lib/mcp/sketchfab-client";

export async function GET() {
  try {
    const isHealthy = await sketchfabClient.healthCheck();

    return NextResponse.json({
      status: isHealthy ? "ok" : "error",
      timestamp: new Date().toISOString(),
      ok: isHealthy,
    });
  } catch (error) {
    console.error("[API] Health check failed", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        ok: false,
      },
      { status: 500 }
    );
  }
}
