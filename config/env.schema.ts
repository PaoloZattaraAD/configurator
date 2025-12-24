// Validazione environment variables

export interface EnvSchema {
  NEXT_PUBLIC_SKETCHFAB_API_KEY: string;
  REF_ENDPOINT?: string;
  SKETCHFAB_MCP_ENDPOINT?: string;
}

export function validateEnv(): EnvSchema {
  const env: EnvSchema = {
    NEXT_PUBLIC_SKETCHFAB_API_KEY:
      process.env.NEXT_PUBLIC_SKETCHFAB_API_KEY || "",
    REF_ENDPOINT: process.env.REF_ENDPOINT,
    SKETCHFAB_MCP_ENDPOINT: process.env.SKETCHFAB_MCP_ENDPOINT,
  };

  // Warn if API key is missing (don't throw in dev)
  if (!env.NEXT_PUBLIC_SKETCHFAB_API_KEY) {
    console.warn(
      "[ENV] NEXT_PUBLIC_SKETCHFAB_API_KEY is not set. Some features may not work."
    );
  }

  return env;
}

export const env = validateEnv();
