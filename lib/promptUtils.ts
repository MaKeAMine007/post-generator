export const STYLE_DESCRIPTIONS: Record<string, string> = {
  "natural-human": "natural and human — write imperfectly, authentically, like a real person. Occasional informal phrasing is fine.",
  "professional": "professional and polished — structured, credible, business-appropriate tone",
  "educational": "educational — informative, clear, teaches the reader something genuinely valuable",
  "storytelling": "narrative-driven — build a story with a beginning, middle, and satisfying payoff",
  "personal-experience": "first-person personal experience — reflective, honest, lived-in authenticity",
  "conversational": "conversational — casual, chatty, easy to read, like talking to a friend",
  "persuasive": "persuasive — compelling, evidence-backed, leads the reader toward a clear conclusion",
  "curious": "curious and exploratory — questioning, open-ended, invites reflection",
  "friendly": "friendly and warm — approachable, encouraging, positive without being saccharine",
  "analytical": "analytical — logical, systematic, well-reasoned with clear structure",
  "data-driven": "data-driven — reference statistics, numbers, and concrete evidence where relevant",
  "minimal": "minimal — brief, punchy, zero filler, every word earns its place",
  "funny": "funny and witty — genuinely humorous, entertaining, clever without being forced",
  "inspirational": "inspirational — motivational, uplifting, pushes the reader toward action",
};

export const CTA_INSTRUCTIONS: Record<string, string> = {
  "soft": "End with a soft, natural community question — e.g. 'What do you think?' or 'Has anyone else experienced this?'",
  "moderate": "End with a moderate engagement prompt — e.g. 'Would love to hear your thoughts' or 'Drop your experience below.'",
  "strong": "End with a clear, direct call to action — encourage the reader to visit the website, sign up, or take a specific next step.",
};

export function resolveWordCount(wordCount: string, custom?: string): string {
  if (wordCount === "custom" && custom?.trim()) return `approximately ${custom.trim()} words`;
  const map: Record<string, string> = {
    "150": "approximately 150 words",
    "300": "approximately 300 words",
    "500": "approximately 500 words",
    "700": "approximately 700 words",
    "1000": "approximately 1000 words",
    "1500": "approximately 1500 words",
  };
  return map[wordCount] || "approximately 300 words";
}

export const QUALITY_RULES = [
  'Write like a real human — authentic, occasionally imperfect, genuinely engaged',
  'NEVER use: "In today\'s world", "In conclusion", "To summarize", "Introduction:", "As an AI", "It\'s important to note", "Firstly" / "Secondly" / "Lastly", "Look no further"',
  'Never sound promotional, advertorial, or like marketing copy',
  'Avoid repetitive wording and generic life-advice platitudes',
  'Optimize for engagement and genuine helpfulness',
  'Use semantic variations of the keyword — never repeat the exact phrase more than twice',
];
