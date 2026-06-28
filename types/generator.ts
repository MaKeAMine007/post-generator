export type Platform = "reddit" | "quora";

export type WritingStyle =
  | "natural-human"
  | "professional"
  | "educational"
  | "storytelling"
  | "personal-experience"
  | "conversational"
  | "persuasive"
  | "curious"
  | "friendly"
  | "analytical"
  | "data-driven"
  | "minimal"
  | "funny"
  | "inspirational";

export type WordCountOption = "150" | "300" | "500" | "700" | "1000" | "1500" | "custom";

export type WebsitePlacement =
  | "none"
  | "brand-only"
  | "mention-naturally"
  | "direct-url-once"
  | "direct-url-twice";

export type CallToAction = "none" | "soft" | "moderate" | "strong";

export type PostObjective =
  | "ask-question"
  | "start-discussion"
  | "share-experience"
  | "tell-story"
  | "give-advice"
  | "comparison"
  | "recommendation"
  | "guide"
  | "ama-style"
  | "opinion"
  | "success-story"
  | "failure-story"
  | "case-study"
  | "request-feedback";

export type QuestionType =
  | "why"
  | "how"
  | "what"
  | "which"
  | "best"
  | "comparison"
  | "opinion"
  | "experience"
  | "guide"
  | "tips";

export type AnswerDepth = "short" | "medium" | "detailed" | "very-detailed";

export interface CommonState {
  keyword: string;
  brand: string;
  websiteUrl: string;
  audience: string;
  writingStyle: WritingStyle;
  wordCount: WordCountOption;
  customWordCount: string;
  additionalInstructions: string;
}

export interface RedditState extends CommonState {
  subreddit: string;
  postObjective: PostObjective;
  websitePlacement: WebsitePlacement;
  brandMention: boolean;
  callToAction: CallToAction;
}

export interface QuoraState extends CommonState {
  questionType: QuestionType;
  answerDepth: AnswerDepth;
  websitePlacement: WebsitePlacement;
  brandMention: boolean;
  callToAction: CallToAction;
}
