import { eq, desc } from "drizzle-orm";
import { createDb } from "./client";
import { appSessions, generationHistory } from "./schema";

const DEFAULT_USER = "default";

// ── Session ──────────────────────────────────────────────

export async function getSession() {
  const db = createDb();
  const [row] = await db
    .select()
    .from(appSessions)
    .where(eq(appSessions.userId, DEFAULT_USER))
    .limit(1);
  return row ?? null;
}

export async function upsertSession(data: Record<string, unknown>) {
  const db = createDb();
  const values = {
    userId: DEFAULT_USER,
    platform: String(data.platform ?? "reddit"),
    targetKeyword: String(data.targetKeyword ?? ""),
    brandName: String(data.brandName ?? ""),
    websiteUrl: String(data.websiteUrl ?? ""),
    targetAudience: String(data.targetAudience ?? ""),
    writingStyle: String(data.writingStyle ?? "natural-human"),
    wordCount: String(data.wordCount ?? "300"),
    customWordCount: String(data.customWordCount ?? ""),
    additionalInstructions: String(data.additionalInstructions ?? ""),
    redditSubreddit: String(data.redditSubreddit ?? ""),
    redditObjective: String(data.redditObjective ?? "start-discussion"),
    quoraQuestionType: String(data.quoraQuestionType ?? "how"),
    quoraAnswerDepth: String(data.quoraAnswerDepth ?? "detailed"),
    websitePlacement: String(data.websitePlacement ?? "none"),
    brandMention: Boolean(data.brandMention ?? true),
    callToAction: String(data.callToAction ?? "none"),
    generatedTitle: String(data.generatedTitle ?? ""),
    generatedBody: String(data.generatedBody ?? ""),
    updatedAt: new Date(),
  };
  await db
    .insert(appSessions)
    .values(values)
    .onConflictDoUpdate({ target: appSessions.userId, set: values });
}

// ── History ───────────────────────────────────────────────

export async function listHistory() {
  const db = createDb();
  return db
    .select()
    .from(generationHistory)
    .where(eq(generationHistory.userId, DEFAULT_USER))
    .orderBy(desc(generationHistory.createdAt));
}

export async function addHistoryEntry(data: Record<string, unknown>) {
  const db = createDb();
  const [entry] = await db
    .insert(generationHistory)
    .values({
      userId: DEFAULT_USER,
      platform: String(data.platform ?? "reddit"),
      targetKeyword: String(data.targetKeyword ?? ""),
      brandName: String(data.brandName ?? ""),
      websiteUrl: String(data.websiteUrl ?? ""),
      targetAudience: String(data.targetAudience ?? ""),
      writingStyle: String(data.writingStyle ?? "natural-human"),
      wordCount: String(data.wordCount ?? "300"),
      customWordCount: String(data.customWordCount ?? ""),
      additionalInstructions: String(data.additionalInstructions ?? ""),
      redditSubreddit: String(data.redditSubreddit ?? ""),
      redditObjective: String(data.redditObjective ?? ""),
      quoraQuestionType: String(data.quoraQuestionType ?? ""),
      quoraAnswerDepth: String(data.quoraAnswerDepth ?? ""),
      websitePlacement: String(data.websitePlacement ?? "none"),
      brandMention: Boolean(data.brandMention ?? true),
      callToAction: String(data.callToAction ?? "none"),
      generatedTitle: String(data.generatedTitle ?? ""),
      generatedBody: String(data.generatedBody ?? ""),
    })
    .returning();
  return entry;
}

export async function removeHistoryEntry(id: string) {
  const db = createDb();
  await db.delete(generationHistory).where(eq(generationHistory.id, id));
}

export async function clearAllHistory() {
  const db = createDb();
  await db
    .delete(generationHistory)
    .where(eq(generationHistory.userId, DEFAULT_USER));
}
