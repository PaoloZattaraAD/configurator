// Log su Ref (per tracciare crediti e azioni)

interface LogEntry {
  action: string;
  credits: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

class RefLogger {
  private logs: LogEntry[] = [];

  /**
   * Log azione con crediti utilizzati
   */
  async logAction(
    action: string,
    credits: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const entry: LogEntry = {
      action,
      credits,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.logs.push(entry);
    console.log("[RefLogger]", entry);
  }

  /**
   * Log fetch modelli
   */
  async logModelsFetch(count: number): Promise<void> {
    await this.logAction("models_fetch", 1, { modelCount: count });
  }

  /**
   * Log fetch materiali
   */
  async logMaterialsFetch(modelId: string, count: number): Promise<void> {
    await this.logAction("materials_fetch", 1, { modelId, materialCount: count });
  }

  /**
   * Log cambio materiale
   */
  async logMaterialChange(
    modelId: string,
    materialId: string
  ): Promise<void> {
    await this.logAction("material_change", 0, { modelId, materialId });
  }

  /**
   * Log cambio texture
   */
  async logTextureChange(
    modelId: string,
    textureId: string
  ): Promise<void> {
    await this.logAction("texture_change", 0, { modelId, textureId });
  }

  /**
   * Ottieni tutti i log
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Calcola crediti totali usati
   */
  getTotalCreditsUsed(): number {
    return this.logs.reduce((sum, log) => sum + log.credits, 0);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

// Singleton instance
export const refLogger = new RefLogger();
