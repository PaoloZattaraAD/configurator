# Prompt Claude Code: 3D Configurator Sketchfab (Next.js 16, MCP Servers)

## 🚀 Stack Moderno

- **Next.js:** v16 (latest)
- **Node.js:** v22
- **React:** 19
- **TypeScript:** 5.7+
- **Tailwind CSS:** v4.1
- **State:** Zustand 5.x
- **API Client:** fetch API nativa + SWR

## 📡 MCP Servers Disponibili (MANDATORY)

1. **Ref** (MANDATORIO)
   - Centro di comando per contesto, documentazione, crediti
   - Traccia tutti i crediti utilizzati da Claude Code
   - Mantiene documentazione aggiornata

2. **context7**
   - Fallback per documentazione Sketchfab OAuth2
   - Info su integrazioni avanzate

3. **sketchfab**
   - Client MCP diretto per Sketchfab API
   - Fetch modelli, materiali, metadata direttamente
   - Query intelligente dei dati

4. **next-devtools & chrome-devtools**
   - Testing frontend
   - Debugging componenti React
   - Performance profiling

---

## 🗂️ Architettura Progetto

```
my-3d-configurator/
├── .ref/
│   ├── CREDITS.md              # Tracciamento crediti Claude Code
│   ├── DOCUMENTATION.md        # Documentazione live
│   ├── SKETCHFAB-SCHEMA.md    # Schema dati Sketchfab
│   └── API-INTEGRATION.md      # Integrazione API

├── config/
│   ├── settings.ts             # Config minimalista
│   ├── mcp-clients.ts          # Inizializzazione MCP servers
│   └── env.schema.ts           # Validazione env vars

├── app/
│   ├── (root)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── api/
│   │   └── sketchfab/
│   │       ├── models/route.ts       # Wrapper a MCP server
│   │       ├── model/[id]/route.ts   # Dettagli modello
│   │       └── health/route.ts       # Health check

├── components/
│   ├── Configurator.tsx
│   ├── Sidebar/
│   │   ├── index.tsx
│   │   ├── Logo.tsx
│   │   ├── ModelSelector.tsx
│   │   ├── MaterialSelector.tsx
│   │   └── TextureSelector.tsx
│   ├── Viewer/
│   │   ├── SketchfabViewer.tsx
│   │   └── ViewerController.ts

├── hooks/
│   ├── useSketchfabAPI.ts      # Wrapper SWR su MCP
│   ├── useModelMaterials.ts
│   ├── useConfigurator.ts      # Zustand store
│   └── useViewerAPI.ts

├── lib/
│   ├── mcp/
│   │   ├── sketchfab-client.ts # Client MCP Sketchfab
│   │   ├── ref-logger.ts       # Log su Ref
│   │   └── types.ts
│   ├── viewer/
│   │   └── sketchfab-viewer.ts # Wrapper Viewer API
│   └── utils.ts

├── types/
│   └── index.ts

└── public/
    └── logo.png
```

---

## 📋 File di Configurazione

### `config/settings.ts`

```typescript
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

  // Sketchfab
  sketchfab: {
    apiKey: process.env.SKETCHFAB_API_KEY,
    // OAuth2 (opzionale, via context7)
    // oauthClientId: process.env.SKETCHFAB_OAUTH_CLIENT_ID,
  },

  // Fetch strategy
  fetchStrategy: {
    models: "mcp", // "mcp" | "rest" | "cache"
    materials: "mcp",
    textures: "mcp",
  },

  // UI
  ui: {
    logo: "/logo.png",
    sidebarWidth: "w-80",
    viewerHeight: "h-screen",
    theme: "dark",
  },

  // Cache
  cache: {
    models: 3600, // 1 hora
    materials: 1800, // 30 min
  },
};
```

### `config/mcp-clients.ts`

```typescript
// Inizializzazione MCP servers
import { createMCPClient } from "@/lib/mcp/base";

export const refClient = createMCPClient("ref");
export const sketchfabClient = createMCPClient("sketchfab");

export async function initMCPServers() {
  try {
    await refClient.connect();
    await sketchfabClient.connect();
    console.log("[MCP] Servers initialized");
  } catch (error) {
    console.error("[MCP] Initialization failed", error);
  }
}
```

---

## 🔌 MCP Integration

### `lib/mcp/sketchfab-client.ts`

```typescript
// Client MCP Sketchfab
// Usa il server MCP sketchfab per comunicare con API Sketchfab

import { CONFIG } from "@/config/settings";

export class SketchfabMCPClient {
  private client: any;

  constructor(mcpClient: any) {
    this.client = mcpClient;
  }

  /**
   * Fetch lista modelli dell'account
   * Delega al server MCP sketchfab
   */
  async getModels(options?: { limit?: number; offset?: number }) {
    const result = await this.client.callTool("sketchfab_list_models", {
      apiKey: CONFIG.sketchfab.apiKey,
      limit: options?.limit || 50,
      offset: options?.offset || 0,
    });

    return result;
  }

  /**
   * Fetch singolo modello con metadata
   */
  async getModel(modelId: string) {
    const result = await this.client.callTool("sketchfab_get_model", {
      apiKey: CONFIG.sketchfab.apiKey,
      modelId,
    });

    return result;
  }

  /**
   * Query intelligente: fetch materiali + texture per modello
   */
  async getModelStructure(modelId: string) {
    const result = await this.client.callTool("sketchfab_get_structure", {
      apiKey: CONFIG.sketchfab.apiKey,
      modelId,
      includeTextures: true,
    });

    return result;
  }

  /**
   * Health check API
   */
  async healthCheck() {
    try {
      const result = await this.client.callTool("sketchfab_health", {
        apiKey: CONFIG.sketchfab.apiKey,
      });
      return result.ok === true;
    } catch {
      return false;
    }
  }
}
```

### `lib/mcp/ref-logger.ts`

```typescript
// Log su Ref (MANDATORIO per tracciare crediti)

import { CONFIG } from "@/config/settings";

export class RefLogger {
  private client: any;

  constructor(mcpClient: any) {
    this.client = mcpClient;
  }

  /**
   * Log azione con crediti utilizzati
   */
  async logAction(action: string, credits: number, metadata?: any) {
    await this.client.callTool("ref_log", {
      action,
      credits,
      timestamp: new Date().toISOString(),
      metadata,
    });
  }

  /**
   * Log fetch modelli
   */
  async logModelsFetch(count: number) {
    await this.logAction("models_fetch", 1, { modelCount: count });
  }

  /**
   * Log fetch materiali
   */
  async logMaterialsFetch(modelId: string, count: number) {
    await this.logAction("materials_fetch", 1, { modelId, materialCount: count });
  }

  /**
   * Aggiorna documentazione in Ref
   */
  async updateDocumentation(section: string, content: string) {
    await this.client.callTool("ref_update_doc", {
      section,
      content,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Query crediti rimanenti
   */
  async getCredits() {
    const result = await this.client.callTool("ref_get_credits");
    return result.available;
  }
}
```

---

## 🎯 API Routes (Wrapper a MCP)

### `app/api/sketchfab/models/route.ts`

```typescript
// GET /api/sketchfab/models
// Wrapper che interroga MCP Sketchfab server

import { sketchfabClient } from "@/config/mcp-clients";
import { refLogger } from "@/lib/mcp/ref-logger";

export async function GET(request: Request) {
  try {
    // Fetch da MCP server (non da REST API direttamente)
    const models = await sketchfabClient.getModels({
      limit: 50,
    });

    // Log su Ref
    await refLogger.logModelsFetch(models.length);

    return Response.json(models, {
      headers: { "Cache-Control": "max-age=3600" },
    });
  } catch (error) {
    console.error("Models fetch failed", error);
    return Response.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
```

### `app/api/sketchfab/model/[id]/route.ts`

```typescript
// GET /api/sketchfab/model/[id]
// Fetch struttura completa (materiali + texture)

import { sketchfabClient } from "@/config/mcp-clients";
import { refLogger } from "@/lib/mcp/ref-logger";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const structure = await sketchfabClient.getModelStructure(params.id);

    // Log su Ref
    await refLogger.logMaterialsFetch(params.id, structure.materials.length);

    return Response.json(structure, {
      headers: { "Cache-Control": "max-age=1800" },
    });
  } catch (error) {
    console.error("Model structure fetch failed", error);
    return Response.json(
      { error: "Failed to fetch model structure" },
      { status: 500 }
    );
  }
}
```

---

## 🪝 Hooks (SWR + MCP)

### `hooks/useSketchfabAPI.ts`

```typescript
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSketchfabModels() {
  const { data, error, isLoading } = useSWR(
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
  };
}

export function useModelStructure(modelId: string | null) {
  const { data, error, isLoading } = useSWR(
    modelId ? `/api/sketchfab/model/${modelId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1800000, // 30 min
    }
  );

  return {
    structure: data,
    materials: data?.materials || [],
    loading: isLoading,
    error,
  };
}
```

### `hooks/useConfigurator.ts`

```typescript
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ConfiguratorState {
  selectedModelId: string | null;
  selectedMaterialId: string | null;
  selectedTextureId: string | null;

  selectModel: (modelId: string) => void;
  selectMaterial: (materialId: string) => void;
  selectTexture: (textureId: string) => void;
  reset: () => void;
}

export const useConfigurator = create<ConfiguratorState>()(
  devtools(
    (set) => ({
      selectedModelId: null,
      selectedMaterialId: null,
      selectedTextureId: null,

      selectModel: (modelId) =>
        set({
          selectedModelId: modelId,
          selectedMaterialId: null,
          selectedTextureId: null,
        }),

      selectMaterial: (materialId) =>
        set({
          selectedMaterialId: materialId,
          selectedTextureId: null,
        }),

      selectTexture: (textureId) =>
        set({ selectedTextureId: textureId }),

      reset: () =>
        set({
          selectedModelId: null,
          selectedMaterialId: null,
          selectedTextureId: null,
        }),
    }),
    { name: "configurator-store" }
  )
);
```

---

## ⚛️ Componenti (Next.js 16 + Tailwind 4.1)

### `components/Configurator.tsx`

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { useConfigurator } from "@/hooks/useConfigurator";
import { useSketchfabModels, useModelStructure } from "@/hooks/useSketchfabAPI";
import Sidebar from "./Sidebar";
import SketchfabViewer from "./Viewer/SketchfabViewer";

export default function Configurator() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { selectedModelId, selectModel } = useConfigurator();
  const { models, loading: loadingModels } = useSketchfabModels();
  const { materials, loading: loadingStructure } =
    useModelStructure(selectedModelId);

  // Auto-select primo modello
  useEffect(() => {
    if (models.length > 0 && !selectedModelId) {
      selectModel(models[0].uid);
    }
  }, [models, selectedModelId, selectModel]);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <Sidebar
        models={models}
        materials={materials}
        loading={loadingModels || loadingStructure}
      />

      <div className="flex-1 flex flex-col">
        {selectedModelId && (
          <SketchfabViewer
            ref={iframeRef}
            modelId={selectedModelId}
            height="h-full"
          />
        )}
      </div>
    </div>
  );
}
```

### `components/Sidebar/index.tsx`

```typescript
"use client";

import { CONFIG } from "@/config/settings";
import ModelSelector from "./ModelSelector";
import MaterialSelector from "./MaterialSelector";

interface SidebarProps {
  models: any[];
  materials: any[];
  loading: boolean;
}

export default function Sidebar({ models, materials, loading }: SidebarProps) {
  return (
    <div
      className={`${CONFIG.ui.sidebarWidth} bg-slate-900 p-6 overflow-y-auto border-r border-slate-700`}
    >
      {/* Logo */}
      <div className="mb-8">
        <img
          src={CONFIG.ui.logo}
          alt="Logo"
          className="h-12 object-contain"
        />
      </div>

      {/* Selectors */}
      <div className="space-y-6">
        <ModelSelector models={models} loading={loading} />
        <MaterialSelector materials={materials} loading={loading} />
      </div>
    </div>
  );
}
```

### `components/Sidebar/ModelSelector.tsx`

```typescript
"use client";

import { useConfigurator } from "@/hooks/useConfigurator";

interface Model {
  uid: string;
  name: string;
  thumbnail?: string;
}

export default function ModelSelector({
  models,
  loading,
}: {
  models: Model[];
  loading: boolean;
}) {
  const { selectedModelId, selectModel } = useConfigurator();

  return (
    <div>
      <label className="block text-sm font-semibold mb-3 text-slate-300">
        Modello
      </label>

      <div className="space-y-2">
        {models.map((model) => (
          <button
            key={model.uid}
            onClick={() => selectModel(model.uid)}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
              selectedModelId === model.uid
                ? "bg-blue-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            } disabled:opacity-50`}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### `components/Sidebar/MaterialSelector.tsx`

```typescript
"use client";

import { useConfigurator } from "@/hooks/useConfigurator";

interface Material {
  id: string;
  name: string;
}

export default function MaterialSelector({
  materials,
  loading,
}: {
  materials: Material[];
  loading: boolean;
}) {
  const { selectedMaterialId, selectMaterial } = useConfigurator();

  return (
    <div>
      <label className="block text-sm font-semibold mb-3 text-slate-300">
        Materiali
      </label>

      <div className="space-y-2">
        {materials.map((material) => (
          <button
            key={material.id}
            onClick={() => selectMaterial(material.id)}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
              selectedMaterialId === material.id
                ? "bg-blue-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            } disabled:opacity-50`}
          >
            {material.name}
          </button>
        ))}

        {materials.length === 0 && !loading && (
          <p className="text-sm text-slate-500">Nessun materiale</p>
        )}
      </div>
    </div>
  );
}
```

### `components/Viewer/SketchfabViewer.tsx`

```typescript
"use client";

import { forwardRef } from "react";

interface SketchfabViewerProps {
  modelId: string;
  height: string;
}

const SketchfabViewer = forwardRef<HTMLIFrameElement, SketchfabViewerProps>(
  ({ modelId, height }, ref) => {
    return (
      <iframe
        ref={ref}
        title="Sketchfab 3D Viewer"
        className={`w-full ${height}`}
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking; clipboard-write"
        src={`https://sketchfab.com/models/${modelId}/embed?autospin=1&autostart=1`}
      />
    );
  }
);

SketchfabViewer.displayName = "SketchfabViewer";

export default SketchfabViewer;
```

---

## 🎨 Styling (Tailwind 4.1)

### `app/globals.css`

```css
@import "tailwindcss";

@layer base {
  * {
    @apply transition-colors duration-200;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-slate-950 text-white;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors;
  }

  .btn-secondary {
    @apply px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors;
  }

  .sidebar-section {
    @apply mb-6 pb-6 border-b border-slate-700 last:border-b-0;
  }
}
```

### `app/layout.tsx`

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Configurator",
  description: "Interactive 3D product configurator powered by Sketchfab",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Sketchfab Viewer API */}
        <script
          async
          src="https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 📦 Dependencies (package.json)

```json
{
  "name": "3d-configurator",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0",
    "swr": "^2.2.0",
    "tailwindcss": "^4.1.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "tailwindcss": "^4.1.0"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

---

## 🔐 Environment Variables

**File: `.env.local`**

```bash
# Sketchfab API
SKETCHFAB_API_KEY=your_api_key_here

# MCP Servers (opzionale, auto-discovery)
REF_ENDPOINT=http://localhost:3000
SKETCHFAB_MCP_ENDPOINT=http://localhost:3001
```

---

## 📚 Ref Documentation (MANDATORIO)

### `.ref/CREDITS.md`

Questo file viene aggiornato automaticamente da Claude Code per tracciare crediti utilizzati.

```markdown
# Claude Code Credits Log

## Overview
- Total Credits: [AUTO-UPDATE]
- Available: [AUTO-UPDATE]
- Used Today: [AUTO-UPDATE]

## Actions Logged
- [timestamp] models_fetch: 1 credit
- [timestamp] materials_fetch: 1 credit
...
```

### `.ref/SKETCHFAB-SCHEMA.md`

Schema dati Sketchfab per referenza veloce.

```markdown
# Sketchfab Data Schema

## Model Structure
- uid: string (modello ID)
- name: string
- thumbnail: string
- materials: Material[]

## Material
- id: string
- name: string
- textures: Texture[]

## Texture
- id: string
- name: string
- type: "diffuse" | "normal" | "specular" | "roughness"
```

---

## 🧪 Testing & Debugging

### Usa next-devtools

```bash
# Installare globalmente
npm install -g next-devtools

# Nel dev server
npm run dev
# Apri chrome://devtools
```

### Usa chrome-devtools

- Performance: Tab "Performance"
- React DevTools: estensione Chrome
- Network: Tab "Network" per MCP calls

---

## 🚀 Quick Start

```bash
# 1. Setup
node --version # Verifica Node 22+
npm install

# 2. Env vars
cp .env.example .env.local
# Aggiungi SKETCHFAB_API_KEY

# 3. Avvia dev server
npm run dev

# 4. Apri
open http://localhost:3000

# 5. Avvia MCP servers (in altro terminal)
# (sketchfab, ref, devtools)
```

---

## ✅ Implementation Checklist

- [ ] Setup Next.js 16 con Node 22
- [ ] Installa dependencies (tailwind 4.1, zustand 5, swr 2)
- [ ] Configura TypeScript
- [ ] Crea struttura `.ref/`
- [ ] Setup MCP clients (Ref, Sketchfab)
- [ ] Implementa API routes (wrappers a MCP)
- [ ] Build hooks (useSketchfabAPI, useConfigurator)
- [ ] Build componenti Sidebar + Viewer
- [ ] Setup Tailwind 4.1 + globals.css
- [ ] Test con devtools
- [ ] Deploy

---

## 🎯 Expected Output

**Page:** `http://localhost:3000`

**Behavior:**
1. ✅ MCP Sketchfab server fetcha lista modelli dinamicamente
2. ✅ Ref logger traccia crediti usati
3. ✅ User seleziona modello → Viewer si aggiorna
4. ✅ Materiali caricati dinamicamente da MCP
5. ✅ Componenti responsive con Tailwind 4.1
6. ✅ State managed via Zustand + devtools

---

## 📖 MCP Server Integration Pattern

Ogni volta che devi fare una query Sketchfab:

1. **Chiama MCP Sketchfab server** (non REST API direttamente)
2. **MCP server** elabora la query
3. **API route** riceve risultato
4. **RefLogger** traccia crediti
5. **Frontend** riceve dati via SWR hook

**Vantaggi:**
- Centralizzato: MCP server è il proxy
- Efficiente: caching a livello MCP
- Tracciato: Ref logger conosce tutto
- Intelligente: MCP può fare query intelligenti

---

## 🔗 Riferimenti Utili

- **Ref MCP:** Vedi `.ref/` per docs
- **context7:** Fallback OAuth2
- **sketchfab MCP:** Query dirette a Sketchfab API
- **Next.js 16:** https://nextjs.org/blog/next-16
- **Tailwind 4.1:** https://tailwindcss.com
- **Zustand:** https://github.com/pmndrs/zustand

---

## ⚡ Pro Tips

1. **Zustand + devtools:** Puoi debuggare lo state in tempo reale
2. **SWR:** Auto-revalidate quando il tab torna in focus
3. **MCP Ref:** Controlla i crediti prima di batch operations
4. **next-devtools:** Usa per profiling delle API routes

---

**Status:** Ready for Claude Code implementation 🚀
