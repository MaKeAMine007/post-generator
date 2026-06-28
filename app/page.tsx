"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import PlatformSelector from "@/components/PlatformSelector";
import CommonFields from "@/components/CommonFields";
import GenerateButton from "@/components/GenerateButton";
import ProgressSection from "@/components/ProgressSection";
import ResultCard from "@/components/ResultCard";
import RegenerateButtons from "@/components/RegenerateButtons";
import HistoryPanel from "@/components/HistoryPanel";
import RedditFields from "@/components/RedditFields";
import QuoraFields from "@/components/QuoraFields";
import { addToHistory, HistoryEntry } from "@/lib/historyStorage";
import type {
  Platform,
  RedditState,
  QuoraState,
  CommonState,
} from "@/types/generator";

const ACCENT_COLORS: Record<Platform, string> = {
  reddit: "#FF6B35",
  quora: "#B92B27",
};

const DEFAULT_COMMON: CommonState = {
  keyword: "",
  brand: "",
  websiteUrl: "",
  audience: "",
  writingStyle: "natural-human",
  wordCount: "300",
  customWordCount: "",
  additionalInstructions: "",
};

const DEFAULT_REDDIT: RedditState = {
  ...DEFAULT_COMMON,
  subreddit: "",
  postObjective: "start-discussion",
  websitePlacement: "none",
  brandMention: true,
  callToAction: "none",
};

const DEFAULT_QUORA: QuoraState = {
  ...DEFAULT_COMMON,
  questionType: "how",
  answerDepth: "detailed",
  websitePlacement: "none",
  brandMention: true,
  callToAction: "none",
};

const PLATFORM_LABELS = {
  reddit: {
    titleHeading: "Post Title",
    titleLabel: "Title",
    titlePlaceholder: "Your Reddit title will appear here...",
    postHeading: "Post Body",
    postLabel: "Post",
    postPlaceholder: "Your Reddit post will appear here...",
  },
  quora: {
    titleHeading: "Question",
    titleLabel: "Question",
    titlePlaceholder: "Your Quora question will appear here...",
    postHeading: "Answer",
    postLabel: "Answer",
    postPlaceholder: "Your Quora answer will appear here...",
  },
} as const;

function buildHistoryPayload(
  platform: Platform,
  cur: RedditState | QuoraState,
  redditState: RedditState,
  quoraState: QuoraState,
  title: string,
  body: string
): Omit<HistoryEntry, "id" | "timestamp"> {
  return {
    platform,
    keyword: cur.keyword,
    brand: cur.brand,
    websiteUrl: cur.websiteUrl,
    audience: cur.audience,
    writingStyle: cur.writingStyle,
    wordCount: cur.wordCount,
    customWordCount: cur.customWordCount,
    additionalInstructions: cur.additionalInstructions,
    brandMention: cur.brandMention,
    websitePlacement: cur.websitePlacement,
    callToAction: cur.callToAction,
    subreddit: platform === "reddit" ? redditState.subreddit : undefined,
    postObjective: platform === "reddit" ? redditState.postObjective : undefined,
    questionType: platform === "quora" ? quoraState.questionType : undefined,
    answerDepth: platform === "quora" ? quoraState.answerDepth : undefined,
    title,
    body,
  };
}

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("reddit");
  const [redditState, setRedditState] = useState<RedditState>(DEFAULT_REDDIT);
  const [quoraState, setQuoraState] = useState<QuoraState>(DEFAULT_QUORA);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const accentColor = ACCENT_COLORS[platform];
  const anyLoading = isLoading || isLoadingTitle || isLoadingPost;
  const pl = PLATFORM_LABELS[platform];

  const cur = platform === "reddit" ? redditState : quoraState;

  function handleCommonChange(updates: Partial<CommonState>) {
    if (platform === "reddit") {
      setRedditState((prev) => ({ ...prev, ...updates }));
    } else {
      setQuoraState((prev) => ({ ...prev, ...updates }));
    }
  }

  async function callGenerate(
    payload: Record<string, unknown>
  ): Promise<{ title: string; body: string }> {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? `Error: ${res.status}`);
    return { title: data.title ?? "", body: data.body ?? "" };
  }

  const handleGenerate = async () => {
    if (!cur.keyword.trim()) {
      setError("Please enter a target keyword.");
      return;
    }
    setHasGenerated(true);
    setIsLoading(true);
    setError("");
    setTitle("");
    setBody("");

    const payload = { platform, ...cur, mode: "all" };

    try {
      const data = await callGenerate(payload);
      setTitle(data.title);
      setBody(data.body);
      if (data.title || data.body) {
        addToHistory(buildHistoryPayload(platform, cur, redditState, quoraState, data.title, data.body));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateTitle = async () => {
    if (!cur.keyword.trim()) return;
    setIsLoadingTitle(true);
    setError("");
    const payload = { platform, ...cur, mode: "title", existingBody: body };
    try {
      const data = await callGenerate(payload);
      setTitle(data.title);
      addToHistory(buildHistoryPayload(platform, cur, redditState, quoraState, data.title, body));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoadingTitle(false);
    }
  };

  const handleRegeneratePost = async () => {
    if (!cur.keyword.trim()) return;
    setIsLoadingPost(true);
    setError("");
    const payload = { platform, ...cur, mode: "post", existingTitle: title };
    try {
      const data = await callGenerate(payload);
      setBody(data.body);
      addToHistory(buildHistoryPayload(platform, cur, redditState, quoraState, title, data.body));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleRestore = (entry: HistoryEntry) => {
    const p = entry.platform;
    setPlatform(p);

    const commonFromEntry: CommonState = {
      keyword: entry.keyword ?? "",
      brand: entry.brand ?? "",
      websiteUrl: entry.websiteUrl ?? "",
      audience: entry.audience ?? "",
      writingStyle: (entry.writingStyle as CommonState["writingStyle"]) || "natural-human",
      wordCount: (entry.wordCount as CommonState["wordCount"]) || "300",
      customWordCount: entry.customWordCount ?? "",
      additionalInstructions: entry.additionalInstructions ?? "",
    };

    if (p === "reddit") {
      setRedditState({
        ...commonFromEntry,
        subreddit: entry.subreddit ?? "",
        postObjective: (entry.postObjective as RedditState["postObjective"]) || "start-discussion",
        websitePlacement: (entry.websitePlacement as RedditState["websitePlacement"]) || "none",
        brandMention: entry.brandMention ?? true,
        callToAction: (entry.callToAction as RedditState["callToAction"]) || "none",
      });
    } else {
      setQuoraState({
        ...commonFromEntry,
        questionType: (entry.questionType as QuoraState["questionType"]) || "how",
        answerDepth: (entry.answerDepth as QuoraState["answerDepth"]) || "detailed",
        websitePlacement: (entry.websitePlacement as QuoraState["websitePlacement"]) || "none",
        brandMention: entry.brandMention ?? true,
        callToAction: (entry.callToAction as QuoraState["callToAction"]) || "none",
      });
    }

    setTitle(entry.title);
    setBody(entry.body);
    setHasGenerated(true);
    setError("");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F8F9FB]">
      <Navbar onHistoryClick={() => setShowHistory(true)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="flex-1 min-h-0"
      >
        <div className="h-full max-w-[1450px] mx-auto px-10 py-5 flex flex-col">
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 overflow-hidden">

            {/* ── LEFT PANEL ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
              className="rounded-[18px] border border-[#E5E7EB] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4 overflow-y-auto"
            >
              <PlatformSelector
                value={platform}
                onChange={setPlatform}
                accentColor={accentColor}
              />

              <div className="h-px bg-[#F3F4F6]" />

              <CommonFields
                state={cur}
                onChange={handleCommonChange}
                accentColor={accentColor}
              />

              <div className="h-px bg-[#F3F4F6]" />

              <AnimatePresence mode="wait">
                {platform === "reddit" ? (
                  <motion.div
                    key="reddit-fields"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    <RedditFields
                      state={redditState}
                      onChange={(updates) => setRedditState((prev) => ({ ...prev, ...updates }))}
                      accentColor={accentColor}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="quora-fields"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    <QuoraFields
                      state={quoraState}
                      onChange={(updates) => setQuoraState((prev) => ({ ...prev, ...updates }))}
                      accentColor={accentColor}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px bg-[#F3F4F6]" />

              <GenerateButton
                onClick={handleGenerate}
                isLoading={isLoading}
                accentColor={accentColor}
              />

            </motion.div>

            {/* ── RIGHT PANEL ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="flex flex-col gap-3 h-full min-h-0 overflow-hidden"
            >
              <ProgressSection isLoading={isLoading} accentColor={accentColor} />

              <AnimatePresence>
                {error && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="text-[14px] text-red-500 font-medium text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {hasGenerated && (
                <RegenerateButtons
                  onRegenerateAll={handleGenerate}
                  isLoading={anyLoading}
                />
              )}

              <ResultCard
                heading={pl.titleHeading}
                label={pl.titleLabel}
                content={title}
                onChange={setTitle}
                onRegenerate={handleRegenerateTitle}
                placeholder={pl.titlePlaceholder}
                isLoading={isLoading || isLoadingTitle}
                isTitle
                accentColor={accentColor}
              />

              <ResultCard
                heading={pl.postHeading}
                label={pl.postLabel}
                content={body}
                onChange={setBody}
                onRegenerate={handleRegeneratePost}
                placeholder={pl.postPlaceholder}
                isLoading={isLoading || isLoadingPost}
                accentColor={accentColor}
                grow
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onRestore={handleRestore}
      />
    </div>
  );
}
