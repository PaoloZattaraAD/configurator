// Configurazione minimalista

export const CONFIG = {
  // MCP Servers
  mcp: {
    ref: {
      enabled: true,
      endpoint: process.env.REF_ENDPOINT || "http://localhost:3000",
    },
    sketchfab: {
      enabled: true,
      endpoint: process.env.SKETCHFAB_MCP_ENDPOINT,
    },
  },

  // Sketchfab (server-side only - API key not exposed to client)
  sketchfab: {
    apiKey: process.env.SKETCHFAB_API_KEY,
    baseUrl: "https://api.sketchfab.com/v3",
  },

  // Fetch strategy
  fetchStrategy: {
    models: "mcp" as const, // "mcp" | "rest" | "cache"
    materials: "mcp" as const,
    textures: "mcp" as const,
  },

  // UI
  ui: {
    logo: "/logo.svg",
    sidebarWidth: "w-80",
    viewerHeight: "h-screen",
    theme: "dark" as const,
  },

  // Cache (in seconds)
  cache: {
    models: 3600, // 1 hora
    materials: 1800, // 30 min
  },
} as const;

export type Config = typeof CONFIG;
