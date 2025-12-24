# API Integration Guide

## MCP Server Pattern

Every Sketchfab query follows this pattern:

1. **Frontend** calls internal API route
2. **API Route** calls MCP Sketchfab server
3. **MCP Server** queries Sketchfab API
4. **RefLogger** tracks credits used
5. **Response** returned via SWR hook

## Endpoints

### Models
```
GET /api/sketchfab/models
Query params:
  - limit: number (default: 50)
  - offset: number (default: 0)
```

### Model Structure
```
GET /api/sketchfab/model/[id]
Params:
  - id: model UID
Returns:
  - materials[]
  - textures[]
```

### Health Check
```
GET /api/sketchfab/health
Returns:
  - status: "ok" | "error"
  - timestamp: ISO string
```

## Authentication

API Key is passed via:
- Environment variable: `NEXT_PUBLIC_SKETCHFAB_API_KEY`
- Header: `Authorization: Token <api_key>`

## Rate Limits

Sketchfab API limits:
- 1000 requests/hour for authenticated users
- 100 requests/hour for anonymous

## Error Handling

All API routes return:
```typescript
// Success
{ data: T, ok: true }

// Error
{ error: string, ok: false, status: number }
```
