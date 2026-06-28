import type { RedditState, QuoraState } from "@/types/generator";
import { STYLE_DESCRIPTIONS, resolveWordCount } from "@/lib/promptUtils";

type AnyState = Partial<RedditState & QuoraState>;

const OBJECTIVE_SHORT: Record<string, string> = {
  "ask-question": "community question seeking input",
  "start-discussion": "discussion starter",
  "share-experience": "personal experience share",
  "tell-story": "narrative story",
  "give-advice": "practical advice",
  "comparison": "comparison post",
  "recommendation": "recommendation",
  "guide": "practical guide",
  "ama-style": "AMA-style introduction",
  "opinion": "opinion piece",
  "success-story": "success story",
  "failure-story": "failure/lesson story",
  "case-study": "case study",
  "request-feedback": "feedback request",
};

const DEPTH_SHORT: Record<string, string> = {
  "short": "~200 words, concise",
  "medium": "~400 words, focused",
  "detailed": "~800 words, thorough",
  "very-detailed": "1200+ words, comprehensive",
};

export function buildTitleOnlyPrompt(
  platform: "reddit" | "quora",
  state: AnyState,
  existingBody: string
): string {
  const keyword = state.keyword?.trim() || "";
  const style = state.writingStyle || "natural-human";
  const styleDesc = STYLE_DESCRIPTIONS[style] || style;

  if (platform === "reddit") {
    const subreddit = state.subreddit?.trim().replace(/^r\//, "");
    return `Generate a new Reddit post title only. Do not rewrite the body.

KEYWORD: "${keyword}" — incorporate naturally in the title if it fits.
${subreddit ? `SUBREDDIT CONTEXT: r/${subreddit} — match this community's typical title style and tone.` : ""}
WRITING STYLE: ${styleDesc}
EXISTING BODY (context only — do not rewrite):
${existingBody}

Write a title that sounds like a real person typed it: specific, human, not clickbait, not formal. No "Introduction:" or summary-style headings.

Return in EXACTLY this format with no extra text:

POST_TITLE:
<new title here>

POST_BODY:
(unchanged)`;
  } else {
    const qType = state.questionType || "how";
    const qTypeHints: Record<string, string> = {
      "why": "start with Why",
      "how": "start with How",
      "what": "start with What",
      "which": "start with Which",
      "best": "use 'best' superlative phrasing",
      "comparison": "frame as X vs Y",
      "opinion": "frame as opinion request",
      "experience": "ask about personal experience",
      "guide": "ask for a guide or roadmap",
      "tips": "ask for tips or advice",
    };
    return `Generate a new Quora question only. Do not rewrite the answer.

KEYWORD: "${keyword}" — incorporate naturally in the question if it fits.
QUESTION TYPE: ${qTypeHints[qType] || qType}
EXISTING ANSWER (context only — do not rewrite):
${existingBody}

Write a natural Quora question that a real person would search for.

Return in EXACTLY this format with no extra text:

QUESTION:
<new question here>

ANSWER:
(unchanged)`;
  }
}

export function buildPostOnlyPrompt(
  platform: "reddit" | "quora",
  state: AnyState,
  existingTitle: string
): string {
  const keyword = state.keyword?.trim() || "";
  const style = state.writingStyle || "natural-human";
  const styleDesc = STYLE_DESCRIPTIONS[style] || style;
  const wc = resolveWordCount(state.wordCount || "300", state.customWordCount);

  if (platform === "reddit") {
    const subreddit = state.subreddit?.trim().replace(/^r\//, "");
    const objective = state.postObjective ? (OBJECTIVE_SHORT[state.postObjective] || state.postObjective) : "discussion post";
    return `Generate a new Reddit post body only. Do not rewrite the title.

KEYWORD: "${keyword}" — incorporate naturally.
EXISTING TITLE (stay consistent with this):
${existingTitle}
${subreddit ? `SUBREDDIT: r/${subreddit} — match this community's style.` : ""}
WRITING STYLE: ${styleDesc}
POST OBJECTIVE: ${objective}
TARGET LENGTH: ${wc}
${state.additionalInstructions?.trim() ? `ADDITIONAL REQUIREMENTS: ${state.additionalInstructions.trim()}` : ""}

Write a natural Reddit post body. No "Introduction", "Conclusion", or AI-sounding phrases. Hook immediately in the first sentence. End naturally — do not summarize.

Return in EXACTLY this format with no extra text:

POST_TITLE:
(unchanged)

POST_BODY:
<new body here>`;
  } else {
    const depth = state.answerDepth ? (DEPTH_SHORT[state.answerDepth] || state.answerDepth) : "~800 words";
    return `Generate a new Quora answer only. Do not rewrite the question.

KEYWORD: "${keyword}" — incorporate naturally.
EXISTING QUESTION (stay consistent with this):
${existingTitle}
WRITING STYLE: ${styleDesc}
ANSWER DEPTH: ${depth}
TARGET LENGTH: ${wc}
${state.additionalInstructions?.trim() ? `ADDITIONAL REQUIREMENTS: ${state.additionalInstructions.trim()}` : ""}

Write a top Quora answer — expert, direct, actionable. Start by answering the question immediately, no preamble. End strongly.

Return in EXACTLY this format with no extra text:

QUESTION:
(unchanged)

ANSWER:
<new answer here>`;
  }
}
