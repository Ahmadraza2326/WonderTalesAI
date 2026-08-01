export class IllustrationCache {
  // In-memory storage for now; this can be replaced later with a persistent backend.
  private readonly store = new Map<string, string>();

  async has(key: string): Promise<boolean> {
    return this.store.has(key);
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async save(key: string, imageUrl: string): Promise<void> {
    this.store.set(key, imageUrl);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }
}
