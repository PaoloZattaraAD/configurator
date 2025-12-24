# 3D Configurator Documentation

## Overview
Interactive 3D product configurator powered by Sketchfab API.

## Architecture
- **Frontend:** Next.js 16 + React 19
- **State Management:** Zustand 5
- **Data Fetching:** SWR + MCP Servers
- **Styling:** Tailwind CSS 4.1

## MCP Integration
This project uses MCP (Model Context Protocol) servers for:
- Sketchfab API queries
- Credit tracking via Ref
- Documentation updates

## Components
- `Configurator` - Main wrapper component
- `Sidebar` - Model/Material selectors
- `SketchfabViewer` - 3D model viewer iframe

## Hooks
- `useSketchfabAPI` - SWR-based API fetching
- `useConfigurator` - Zustand store for state
- `useModelStructure` - Fetch materials/textures

## API Routes
- `GET /api/sketchfab/models` - List all models
- `GET /api/sketchfab/model/[id]` - Get model structure
- `GET /api/sketchfab/health` - Health check
