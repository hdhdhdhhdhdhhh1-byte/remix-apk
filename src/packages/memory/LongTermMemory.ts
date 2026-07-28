import type { MemoryRecord } from "../shared/types";

const STORAGE_KEY = "nico.ltm.v1";

/**
 * Durable memory. Backed by localStorage in the browser today; the same
 * interface is implemented by the SQLite/Postgres adapter on the server.
 */
export class LongTermMemory {
  private records: MemoryRecord[] = [];

  constructor(private readonly persistent = true) {
    this.load();
  }

  private load() {
    if (!this.persistent || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) this.records = JSON.parse(raw) as MemoryRecord[];
    } catch {
      this.records = [];
    }
  }

  private save() {
    if (!this.persistent || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
    } catch {
      /* quota — memory stays in-process */
    }
  }

  all(): MemoryRecord[] {
    return [...this.records].sort((a, b) => b.score - a.score);
  }

  write(record: Omit<MemoryRecord, "id" | "createdAt" | "score">): MemoryRecord {
    const existing = this.records.find((r) => r.key === record.key);
    if (existing) {
      existing.value = record.value;
      existing.score += 1;
      this.save();
      return existing;
    }
    const created: MemoryRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      score: 1,
    };
    this.records.push(created);
    this.save();
    return created;
  }

  search(query: string, limit = 5): MemoryRecord[] {
    const q = query.toLowerCase();
    const tokens = q.split(/\s+/).filter((t) => t.length > 2);
    return this.records
      .map((r) => {
        const hay = `${r.key} ${r.value}`.toLowerCase();
        const hits = tokens.filter((t) => hay.includes(t)).length;
        return { r, hits };
      })
      .filter((x) => x.hits > 0)
      .sort((a, b) => b.hits - a.hits || b.r.score - a.r.score)
      .slice(0, limit)
      .map((x) => x.r);
  }

  forget(id: string) {
    this.records = this.records.filter((r) => r.id !== id);
    this.save();
  }

  clear() {
    this.records = [];
    this.save();
  }
}
