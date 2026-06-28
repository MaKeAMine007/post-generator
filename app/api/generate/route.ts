import { NextRequest, NextResponse } from "next/server";
import { buildRedditPrompt } from "@/lib/redditPrompt";
import { buildQuoraPrompt } from "@/lib/quoraPrompt";
import { buildTitleOnlyPrompt, buildPostOnlyPrompt } from "@/lib/promptBuilder";
import type { RedditState, QuoraState } from "@/types/generator";

type Platform = "reddit" | "quora";
type Mode = "all" | "title" | "post";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    return NextResponse.json(
      {
        error:
          "Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file and restart the development server.",
      },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { platform, mode = "all" as Mode, existingTitle = "", existingBody = "", ...state } = body;

  if (!state.keyword?.trim()) {
    return NextResponse.json({ error: "Target keyword is required." }, { status: 400 });
  }

  const p = platform as Platform;
  let prompt: string;

  if (mode === "title") {
    prompt = buildTitleOnlyPrompt(p, state, existingBody);
  } else if (mode === "post") {
    prompt = buildPostOnlyPrompt(p, state, existingTitle);
  } else {
    prompt = p === "reddit"
      ? buildRedditPrompt(state as RedditState)
      : buildQuoraPrompt(state as QuoraState);
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!geminiRes.ok) {
      const errData = await geminiRes.json();
      return NextResponse.json(
        { error: errData?.error?.message ?? `Gemini API error: ${geminiRes.status}` },
        { status: geminiRes.status }
      );
    }

    const data = await geminiRes.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsedTitle = "";
    let parsedBody = "";

    if (p === "reddit") {
      const titleMatch = text.match(/POST_TITLE:\s*([\s\S]*?)(?=\n\s*POST_BODY:)/i);
      const bodyMatch = text.match(/POST_BODY:\s*([\s\S]*)/i);
      parsedTitle = titleMatch?.[1]?.trim() ?? "";
      parsedBody = bodyMatch?.[1]?.trim() ?? "";
    } else {
      const titleMatch = text.match(/QUESTION:\s*([\s\S]*?)(?=\n\s*ANSWER:)/i);
      const bodyMatch = text.match(/ANSWER:\s*([\s\S]*)/i);
      parsedTitle = titleMatch?.[1]?.trim() ?? "";
      parsedBody = bodyMatch?.[1]?.trim() ?? "";
    }

    return NextResponse.json({
      title: parsedTitle === "(unchanged)" ? existingTitle : parsedTitle,
      body: parsedBody === "(unchanged)" ? existingBody : parsedBody,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
