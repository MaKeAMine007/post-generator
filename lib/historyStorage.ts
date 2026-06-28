export type Platform = "reddit" | "quora";

export interface HistoryEntry {
  id: string;
  platform: Platform;
  keyword: string;
  brand: string;
  websiteUrl: string;
  audience: string;
  writingStyle: string;
  wordCount: string;
  customWordCount: string;
  additionalInstructions: string;
  brandMention: boolean;
  websitePlacement: string;
  callToAction: string;
  subreddit?: string;
  postObjective?: string;
  questionType?: string;
  answerDepth?: string;
  title: string;
  body: string;
  timestamp: number;
}

const STORAGE_KEY = "content_gen_history";
const MAX_ENTRIES = 20;

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addToHistory(entry: Omit<HistoryEntry, "id" | "timestamp">): void {
  try {
    const history = getHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — silently skip
  }
}

export function deleteHistoryEntry(id: string): void {
  try {
    const updated = getHistory().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
