# Sketchfab Data Schema

## Model Structure
```typescript
interface Model {
  uid: string;          // Unique model ID
  name: string;         // Display name
  description?: string; // Optional description
  thumbnail?: {
    url: string;
  };
  viewerUrl: string;
  embedUrl: string;
  materials?: Material[];
}
```

## Material
```typescript
interface Material {
  id: string;
  name: string;
  channels: MaterialChannel[];
  textures?: Texture[];
}
```

## Material Channel
```typescript
interface MaterialChannel {
  name: string;        // e.g., "AlbedoPBR", "NormalMap"
  value?: number[];    // RGB or RGBA values
  texture?: Texture;
}
```

## Texture
```typescript
interface Texture {
  id: string;
  name: string;
  type: "diffuse" | "normal" | "specular" | "roughness" | "metalness" | "ao";
  url: string;
  width: number;
  height: number;
}
```

## API Response Types

### Models List Response
```typescript
interface ModelsResponse {
  results: Model[];
  cursors: {
    next?: string;
    previous?: string;
  };
}
```

### Model Detail Response
```typescript
interface ModelDetailResponse {
  model: Model;
  materials: Material[];
  textures: Texture[];
}
```
