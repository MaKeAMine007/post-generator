import { NextRequest, NextResponse } from "next/server";
import { getSession, upsertSession } from "@/db/queries";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json(null);
    return NextResponse.json({
      platform: session.platform,
      targetKeyword: session.targetKeyword,
      brandName: session.brandName,
      websiteUrl: session.websiteUrl,
      targetAudience: session.targetAudience,
      writingStyle: session.writingStyle,
      wordCount: session.wordCount,
      customWordCount: session.customWordCount,
      additionalInstructions: session.additionalInstructions,
      redditSubreddit: session.redditSubreddit,
      redditObjective: session.redditObjective,
      quoraQuestionType: session.quoraQuestionType,
      quoraAnswerDepth: session.quoraAnswerDepth,
      websitePlacement: session.websitePlacement,
      brandMention: session.brandMention,
      callToAction: session.callToAction,
      generatedTitle: session.generatedTitle,
      generatedBody: session.generatedBody,
    });
  } catch (err) {
    console.error("[GET /api/session]", err);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    await upsertSession(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/session]", err);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}
