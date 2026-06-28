import { pgTable, text, boolean, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";

export const appSessions = pgTable(
  "app_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().default("default"),
    platform: text("platform").notNull().default("reddit"),
    targetKeyword: text("target_keyword").notNull().default(""),
    brandName: text("brand_name").notNull().default(""),
    websiteUrl: text("website_url").notNull().default(""),
    targetAudience: text("target_audience").notNull().default(""),
    writingStyle: text("writing_style").notNull().default("natural-human"),
    wordCount: text("word_count").notNull().default("300"),
    customWordCount: text("custom_word_count").notNull().default(""),
    additionalInstructions: text("additional_instructions").notNull().default(""),
    redditSubreddit: text("reddit_subreddit").notNull().default(""),
    redditObjective: text("reddit_objective").notNull().default("start-discussion"),
    quoraQuestionType: text("quora_question_type").notNull().default("how"),
    quoraAnswerDepth: text("quora_answer_depth").notNull().default("detailed"),
    websitePlacement: text("website_placement").notNull().default("none"),
    brandMention: boolean("brand_mention").notNull().default(true),
    callToAction: text("call_to_action").notNull().default("none"),
    generatedTitle: text("generated_title").notNull().default(""),
    generatedBody: text("generated_body").notNull().default(""),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("app_sessions_user_id_idx").on(table.userId)]
);

export const generationHistory = pgTable("generation_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().default("default"),
  platform: text("platform").notNull().default("reddit"),
  targetKeyword: text("target_keyword").notNull().default(""),
  brandName: text("brand_name").notNull().default(""),
  websiteUrl: text("website_url").notNull().default(""),
  targetAudience: text("target_audience").notNull().default(""),
  writingStyle: text("writing_style").notNull().default("natural-human"),
  wordCount: text("word_count").notNull().default("300"),
  customWordCount: text("custom_word_count").notNull().default(""),
  additionalInstructions: text("additional_instructions").notNull().default(""),
  redditSubreddit: text("reddit_subreddit").notNull().default(""),
  redditObjective: text("reddit_objective").notNull().default(""),
  quoraQuestionType: text("quora_question_type").notNull().default(""),
  quoraAnswerDepth: text("quora_answer_depth").notNull().default(""),
  websitePlacement: text("website_placement").notNull().default("none"),
  brandMention: boolean("brand_mention").notNull().default(true),
  callToAction: text("call_to_action").notNull().default("none"),
  generatedTitle: text("generated_title").notNull().default(""),
  generatedBody: text("generated_body").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AppSession = typeof appSessions.$inferSelect;
export type GenerationHistoryRow = typeof generationHistory.$inferSelect;
