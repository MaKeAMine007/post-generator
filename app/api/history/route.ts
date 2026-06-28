import { NextRequest, NextResponse } from "next/server";
import { listHistory, addHistoryEntry, clearAllHistory } from "@/db/queries";
import type { HistoryEntry } from "@/lib/historyStorage";
import type { Platform } from "@/types/generator";

function toHistoryEntry(row: Awaited<ReturnType<typeof listHistory>>[number]): HistoryEntry {
  return {
    id: row.id,
    platform: row.platform as Platform,
    keyword: row.targetKeyword,
    brand: row.brandName,
    websiteUrl: row.websiteUrl,
    audience: row.targetAudience,
    writingStyle: row.writingStyle,
    wordCount: row.wordCount,
    customWordCount: row.customWordCount,
    additionalInstructions: row.additionalInstructions,
    brandMention: row.brandMention,
    websitePlacement: row.websitePlacement,
    callToAction: row.callToAction,
    subreddit: row.redditSubreddit || undefined,
    postObjective: row.redditObjective || undefined,
    questionType: row.quoraQuestionType || undefined,
    answerDepth: row.quoraAnswerDepth || undefined,
    title: row.generatedTitle,
    body: row.generatedBody,
    timestamp: row.createdAt.getTime(),
  };
}

export async function GET() {
  try {
    const rows = await listHistory();
    return NextResponse.json(rows.map(toHistoryEntry));
  } catch (err) {
    console.error("[GET /api/history]", err);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const d = await req.json();
    await addHistoryEntry({
      platform: d.platform,
      targetKeyword: d.keyword,
      brandName: d.brand,
      websiteUrl: d.websiteUrl,
      targetAudience: d.audience,
      writingStyle: d.writingStyle,
      wordCount: d.wordCount,
      customWordCount: d.customWordCount,
      additionalInstructions: d.additionalInstructions,
      redditSubreddit: d.subreddit,
      redditObjective: d.postObjective,
      quoraQuestionType: d.questionType,
      quoraAnswerDepth: d.answerDepth,
      websitePlacement: d.websitePlacement,
      brandMention: d.brandMention,
      callToAction: d.callToAction,
      generatedTitle: d.title,
      generatedBody: d.body,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/history]", err);
    return NextResponse.json({ error: "Failed to save history entry" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearAllHistory();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/history]", err);
    return NextResponse.json({ error: "Failed to clear history" }, { status: 500 });
  }
}
