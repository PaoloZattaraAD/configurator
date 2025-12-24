// MCP Types

export interface MCPToolResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface MCPClient {
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  callTool: <T = unknown>(
    toolName: string,
    params: Record<string, unknown>
  ) => Promise<MCPToolResult<T>>;
}

export interface SketchfabMCPOptions {
  limit?: number;
  offset?: number;
  includeTextures?: boolean;
}

export interface RefLogAction {
  action: string;
  credits: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
