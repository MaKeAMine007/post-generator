import type { QuoraState } from "@/types/generator";
import { STYLE_DESCRIPTIONS, CTA_INSTRUCTIONS, QUALITY_RULES, resolveWordCount } from "@/lib/promptUtils";

const QUESTION_TYPE_INSTRUCTIONS: Record<string, string> = {
  "why": 'Phrase the question starting with "Why" — e.g. "Why do most startups fail in the first year?"',
  "how": 'Phrase the question starting with "How" — e.g. "How can I improve my writing faster?"',
  "what": 'Phrase as a "What" question — e.g. "What are the best ways to..." or "What does it mean to..."',
  "which": 'Phrase as a "Which" question — e.g. "Which option is better for someone who..."',
  "best": 'Phrase as a "best" superlative question — e.g. "What is the best... in [context]?" or "Which are the top..."',
  "comparison": 'Phrase as a direct comparison — e.g. "[A] vs [B]: which is better for [specific situation]?"',
  "opinion": 'Phrase as an opinion request — e.g. "Is [X] really worth it?" or "Do you think [X] is overrated?"',
  "experience": 'Phrase as an experience question — e.g. "What has been your experience with [X]?" or "Have you tried [X]?"',
  "guide": 'Phrase as a guide or roadmap request — e.g. "What is a complete beginner\'s guide to [topic]?"',
  "tips": 'Phrase as a tips or advice request — e.g. "What are the top tips for someone starting [topic]?"',
};

const DEPTH_INSTRUCTIONS: Record<string, string> = {
  "short": "approximately 200 words — concise and direct. Give the core answer, nothing more.",
  "medium": "approximately 400 words — well-rounded with 2-3 supporting points and a clear structure.",
  "detailed": "approximately 800 words — thorough with examples, context, and logical paragraph flow.",
  "very-detailed": "1200+ words — comprehensive deep-dive. Use examples, sub-points, data references, and actionable steps.",
};

function buildPlacementInstruction(brand: string, url: string, placement: string): string {
  switch (placement) {
    case "brand-only":
      return `Mention ${brand} naturally where it genuinely fits. Do not include any URLs.`;
    case "mention-naturally":
      return `Reference ${brand} naturally in context. If contextually appropriate, you may include ${url} once.`;
    case "direct-url-once":
      return `Include ${url} exactly once, woven naturally into the answer. Do not make it feel forced.`;
    case "direct-url-twice":
      return `Include ${url} twice naturally — once within the body and once near the end.`;
    default:
      return "";
  }
}

export function buildQuoraPrompt(state: QuoraState): string {
  const lines: string[] = [];

  lines.push("You are an expert Quora answer writer and SEO specialist writing for off-page SEO.");
  lines.push("Your goal: create a top-quality Quora question and answer that incorporates the target keyword naturally and provides genuine value.");
  lines.push("");

  lines.push(`PRIMARY KEYWORD: "${state.keyword}"`);
  lines.push("Incorporate this keyword and semantic variations naturally. Never keyword stuff. Helpfulness first.");
  lines.push("");

  const questionType = state.questionType || "how";
  lines.push(`QUESTION FORMAT: ${QUESTION_TYPE_INSTRUCTIONS[questionType]}`);
  lines.push("The question must sound like something a real person would search for on Quora.");
  lines.push("");

  if (state.audience?.trim()) {
    lines.push(`TARGET AUDIENCE: ${state.audience.trim()}`);
    lines.push("Tailor vocabulary, examples, and depth so this audience immediately finds it valuable.");
    lines.push("");
  }

  const hasBrand = !!(state.brand?.trim() && state.brandMention);
  const hasUrl = !!(state.websiteUrl?.trim());
  const placement = state.websitePlacement || "none";

  if (hasBrand) {
    let instruction: string;
    if (placement === "none") {
      instruction = `Mention ${state.brand.trim()} naturally where it fits as one of several helpful options or references. Do not over-promote.`;
    } else {
      instruction = buildPlacementInstruction(state.brand.trim(), hasUrl ? state.websiteUrl.trim() : "", placement);
    }
    lines.push(`BRAND / PROMOTION: ${instruction}`);
    lines.push("");
  } else {
    lines.push("BRAND: Generate completely neutral, unbranded content. Do not mention any company, product, or website.");
    lines.push("");
  }

  const style = state.writingStyle || "natural-human";
  lines.push(`WRITING STYLE: ${STYLE_DESCRIPTIONS[style] || style}`);
  lines.push("");

  const depth = state.answerDepth || "detailed";
  lines.push(`ANSWER DEPTH: ${DEPTH_INSTRUCTIONS[depth]}`);
  lines.push("");

  const wordCountInstruction = resolveWordCount(state.wordCount, state.customWordCount);
  lines.push(`TARGET LENGTH: ${wordCountInstruction} for the answer`);
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
  lines.push("- Start the answer by directly addressing the question — no preamble or 'Great question!'");
  lines.push("- Bullet points or numbered lists are fine when they genuinely improve clarity");
  lines.push("- End strongly — leave the reader with something actionable or memorable");
  lines.push("");

  lines.push("Return in EXACTLY this format with no extra text before or after:");
  lines.push("");
  lines.push("QUESTION:");
  lines.push("<question here>");
  lines.push("");
  lines.push("ANSWER:");
  lines.push("<answer here>");

  return lines.join("\n");
}
