import type { RedditState } from "@/types/generator";
import { STYLE_DESCRIPTIONS, CTA_INSTRUCTIONS, QUALITY_RULES, resolveWordCount } from "@/lib/promptUtils";

const OBJECTIVE_INSTRUCTIONS: Record<string, string> = {
  "ask-question": "Ask a genuine question to the community, seeking opinions or experiences. Should feel like you truly want input from real people.",
  "start-discussion": "Spark a conversation or debate. Present a view, situation, or observation that invites diverse responses.",
  "share-experience": "Share a first-person personal experience. What happened, what you learned, how it felt — raw and honest.",
  "tell-story": "Write a compelling narrative with a clear arc: setup, tension or challenge, resolution or insight.",
  "give-advice": "Offer practical, specific advice from personal experience. Concrete, not generic.",
  "comparison": "Compare two or more options, approaches, or products. Give a balanced or opinionated take with reasoning.",
  "recommendation": "Recommend something based on personal experience. Explain what it is, why it worked, and who it's for.",
  "guide": "Write a practical guide in Reddit post format — conversational but genuinely actionable.",
  "ama-style": "Write an AMA-style introductory post. Introduce yourself, your background, and invite questions from the community.",
  "opinion": "Share a strong, clear opinion with reasoning. Be direct, don't hedge.",
  "success-story": "Share a success story — what was tried, what specifically worked, and the measurable outcome.",
  "failure-story": "Share a failure or hard lesson — be honest about what went wrong and what you'd do differently.",
  "case-study": "Present a real-world case study: the problem, the approach taken, and the result with specifics.",
  "request-feedback": "Ask the community for genuine feedback on an idea, product, decision, or piece of work.",
};

function buildPlacementInstruction(brand: string, url: string, placement: string): string {
  switch (placement) {
    case "brand-only":
      return `Mention ${brand} naturally where it genuinely fits the context. Do not include any URLs.`;
    case "mention-naturally":
      return `Reference ${brand} naturally in context. If contextually appropriate, you may include ${url} once.`;
    case "direct-url-once":
      return `Include ${url} exactly once, woven naturally into the content. Do not make it feel forced or out of place.`;
    case "direct-url-twice":
      return `Include ${url} twice naturally — once within the body and once near the end.`;
    default:
      return "";
  }
}

export function buildRedditPrompt(state: RedditState): string {
  const lines: string[] = [];

  lines.push("You are an expert Reddit content creator and SEO specialist writing for off-page SEO.");
  lines.push("Your goal: create a Reddit post that feels genuinely human, drives real engagement, and incorporates the target keyword naturally.");
  lines.push("");

  lines.push(`PRIMARY KEYWORD: "${state.keyword}"`);
  lines.push("Incorporate this keyword and semantic variations naturally throughout. Never keyword stuff. Readability first.");
  lines.push("");

  const subreddit = state.subreddit?.trim().replace(/^r\//, "");
  if (subreddit) {
    lines.push(`COMMUNITY: r/${subreddit}`);
    lines.push(`Write as if this post naturally belongs in r/${subreddit}. Match the community's vocabulary, tone, formatting norms, and typical post structure. Do NOT mention the subreddit name anywhere in the post.`);
    lines.push("");
  }

  if (state.audience?.trim()) {
    lines.push(`TARGET AUDIENCE: ${state.audience.trim()}`);
    lines.push("Tailor vocabulary, examples, and references so this audience immediately relates.");
    lines.push("");
  }

  const hasBrand = !!(state.brand?.trim() && state.brandMention);
  const hasUrl = !!(state.websiteUrl?.trim());
  const placement = state.websitePlacement || "none";

  if (hasBrand) {
    let instruction: string;
    if (placement === "none") {
      instruction = `Mention ${state.brand.trim()} naturally where it genuinely fits. Do not over-promote. Keep it subtle and authentic — one mention maximum.`;
    } else {
      instruction = buildPlacementInstruction(state.brand.trim(), hasUrl ? state.websiteUrl.trim() : "", placement);
    }
    lines.push(`BRAND / PROMOTION: ${instruction}`);
    lines.push("");
  } else {
    lines.push("BRAND: Generate completely neutral, unbranded content. Do not mention any company, product, or website.");
    lines.push("");
  }

  const objective = state.postObjective || "start-discussion";
  lines.push(`POST OBJECTIVE: ${OBJECTIVE_INSTRUCTIONS[objective]}`);
  lines.push("");

  const style = state.writingStyle || "natural-human";
  lines.push(`WRITING STYLE: ${STYLE_DESCRIPTIONS[style] || style}`);
  lines.push("");

  lines.push(`TARGET LENGTH: ${resolveWordCount(state.wordCount, state.customWordCount)}`);
  lines.push("");

  const cta = state.callToAction || "none";
  if (CTA_INSTRUCTIONS[cta]) {
    lines.push(`CALL TO ACTION: ${CTA_INSTRUCTIONS[cta]}`);
    lines.push("");
  }

  if (state.additionalInstructions?.trim()) {
    lines.push("ADDITIONAL REQUIREMENTS (override all other instructions if there is any conflict):");
    lines.push(state.additionalInstructions.trim());
    lines.push("");
  }

  lines.push("STRICT QUALITY RULES:");
  QUALITY_RULES.forEach((r) => lines.push(`- ${r}`));
  lines.push("- Hook readers in the very first sentence — no warm-up paragraph");
  lines.push("- End naturally — no article-style summary or conclusion");
  lines.push("- Title sounds like something a real person typed: specific, human, not clickbait");
  lines.push("");

  lines.push("Return in EXACTLY this format with no extra text before or after:");
  lines.push("");
  lines.push("POST_TITLE:");
  lines.push("<title here>");
  lines.push("");
  lines.push("POST_BODY:");
  lines.push("<body here>");

  return lines.join("\n");
}
