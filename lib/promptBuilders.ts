type Platform = "reddit" | "quora";

interface PromptParams {
  topic: string;
  audience: string;
  tone: string;
  length?: string;
  subreddit?: string;
  answerDepth?: string;
}

function lengthGuide(length = "medium"): string {
  if (length === "short") return "Keep it concise — around 100–150 words for the body.";
  if (length === "long") return "Write in depth — around 400–600 words for the body.";
  return "Medium length — around 200–300 words for the body.";
}

function depthGuide(depth = "detailed"): string {
  if (depth === "short") return "Keep it concise — around 150–250 words.";
  if (depth === "medium") return "Write moderately — around 300–500 words.";
  if (depth === "very-detailed") return "Write extensively — 1000+ words when appropriate. Be thorough and comprehensive.";
  return "Write in detail — around 600–900 words. Structure clearly with paragraphs.";
}

function subredditInstruction(subreddit: string | undefined): string {
  const r = subreddit?.trim().replace(/^r\//, "");
  if (!r) return "";
  return `\nWrite in a style that would naturally fit inside r/${r}. Match the community's tone and expectations. Do NOT mention the subreddit name in the post.`;
}

export function buildRedditPrompt({ topic, audience, tone, length, subreddit }: PromptParams): string {
  return `You are writing a Reddit post. Write exactly like a real Reddit user — natural, conversational, human. Not polished. Not formal. Not like an AI wrote it.

Topic: ${topic}
Target audience: ${audience || "general Reddit users"}
Tone: ${tone}
${lengthGuide(length)}${subredditInstruction(subreddit)}

STRICT RULES:
- Hook readers immediately in the first sentence
- Write in first person when it feels natural
- Include personal observations or anecdotes where appropriate
- End naturally — do not summarize or conclude like an article
- Encourage discussion or reactions at the end
- NEVER use: "Introduction", "Conclusion", "In today's world", "As an AI", or any marketing language
- No bullet lists — Reddit posts are paragraphs
- Title must sound like something a real person typed: curiosity-driven, human, not clickbait

Return in EXACTLY this format with no extra text before or after:

POST_TITLE:
<title here>

POST_BODY:
<body here>`;
}

export function buildQuoraPrompt({ topic, audience, tone, answerDepth }: PromptParams): string {
  return `You are writing a top Quora answer. Write like an expert who genuinely wants to help — educational, clear, and authoritative but not stiff.

Topic/Question: ${topic}
Target audience: ${audience || "general Quora readers"}
Tone: ${tone}
${depthGuide(answerDepth)}

STRICT RULES:
- The QUESTION must be phrased as a natural Quora question (e.g. "Why do programmers prefer Linux?", "How can I improve my focus?", "What are the biggest mistakes first-time founders make?")
- Start the answer by directly answering the question — no preamble
- Logical flow with clear paragraphs
- Bullet points or numbered lists are fine when they improve clarity
- Give actionable, specific advice — not generic platitudes
- End strongly — leave the reader with something valuable
- NEVER use robotic phrasing, "As an AI", or vague filler

Return in EXACTLY this format with no extra text before or after:

QUESTION:
<question-style title here>

ANSWER:
<answer here>`;
}

export function buildTitleOnlyPrompt(
  platform: Platform,
  { topic, audience, tone, subreddit }: PromptParams,
  existingBody: string
): string {
  const style =
    platform === "reddit"
      ? "curiosity-driven Reddit title that sounds like a real person typed it — not clickbait, not formal"
      : "natural Quora question title (e.g. 'Why do...', 'How can I...', 'What are...')";

  const extra =
    platform === "reddit" && subreddit?.trim()
      ? `\nSubreddit context: r/${subreddit.replace(/^r\//, "")} — match this community's title style.`
      : "";

  return `Generate only a new title for the following ${platform === "reddit" ? "Reddit post" : "Quora answer"}.

Topic: ${topic}
Audience: ${audience || "general"}
Tone: ${tone}${extra}
Existing body (for context only — do not rewrite it):
${existingBody}

Write a ${style}.

Return in EXACTLY this format with no extra text:

${platform === "reddit" ? "POST_TITLE" : "QUESTION"}:
<new title here>

${platform === "reddit" ? "POST_BODY" : "ANSWER"}:
(unchanged)`;
}

export function buildPostOnlyPrompt(
  platform: Platform,
  { topic, audience, tone, length, subreddit, answerDepth }: PromptParams,
  existingTitle: string
): string {
  const style =
    platform === "reddit"
      ? "natural, conversational Reddit post body — human, not polished, paragraph-based, no 'Introduction' or 'Conclusion'"
      : "top Quora answer body — educational, well-structured, actionable, ends strongly";

  const wordGuide = platform === "reddit" ? lengthGuide(length) : depthGuide(answerDepth);

  const extra =
    platform === "reddit" && subreddit?.trim()
      ? `\nWrite in a style that fits r/${subreddit.replace(/^r\//, "")}. Match the community. Do NOT mention the subreddit.`
      : "";

  return `Generate only a new body for the following ${platform === "reddit" ? "Reddit post" : "Quora answer"}.

Topic: ${topic}
Audience: ${audience || "general"}
Tone: ${tone}
${wordGuide}${extra}
Existing title (keep consistent with this):
${existingTitle}

Write a ${style}.

Return in EXACTLY this format with no extra text:

${platform === "reddit" ? "POST_TITLE" : "QUESTION"}:
(unchanged)

${platform === "reddit" ? "POST_BODY" : "ANSWER"}:
<new body here>`;
}
