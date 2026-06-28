"use client";

import { useState, useEffect, useRef } from "react";
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
import type {
  Platform,
  RedditState,
  QuoraState,
  CommonState,
  WritingStyle,
  WordCountOption,
  WebsitePlacement,
  CallToAction,
  PostObjective,
  QuestionType,
  AnswerDepth,
} from "@/types/generator";
import type { HistoryEntry } from "@/lib/historyStorage";

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
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [syncError, setSyncError] = useState(false);

  const accentColor = ACCENT_COLORS[platform];
  const anyLoading = isLoading || isLoadingTitle || isLoadingPost;
  const pl = PLATFORM_LABELS[platform];
  const cur: RedditState | QuoraState = platform === "reddit" ? redditState : quoraState;

  // ── Load session on mount ──────────────────────────────
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const s = await res.json();
          if (s) {
            const common: CommonState = {
              keyword: s.targetKeyword ?? "",
              brand: s.brandName ?? "",
              websiteUrl: s.websiteUrl ?? "",
              audience: s.targetAudience ?? "",
              writingStyle: (s.writingStyle as WritingStyle) || "natural-human",
              wordCount: (s.wordCount as WordCountOption) || "300",
              customWordCount: s.customWordCount ?? "",
              additionalInstructions: s.additionalInstructions ?? "",
            };
            setPlatform((s.platform as Platform) || "reddit");
            setRedditState({
              ...common,
              subreddit: s.redditSubreddit ?? "",
              postObjective: (s.redditObjective as PostObjective) || "start-discussion",
              websitePlacement: (s.websitePlacement as WebsitePlacement) || "none",
              brandMention: s.brandMention ?? true,
              callToAction: (s.callToAction as CallToAction) || "none",
            });
            setQuoraState({
              ...common,
              questionType: (s.quoraQuestionType as QuestionType) || "how",
              answerDepth: (s.quoraAnswerDepth as AnswerDepth) || "detailed",
              websitePlacement: (s.websitePlacement as WebsitePlacement) || "none",
              brandMention: s.brandMention ?? true,
              callToAction: (s.callToAction as CallToAction) || "none",
            });
            if (s.generatedTitle || s.generatedBody) {
              setTitle(s.generatedTitle ?? "");
              setBody(s.generatedBody ?? "");
              setHasGenerated(true);
            }
          }
        }
      } catch {
        // DB unavailable — continue with defaults
      } finally {
        setSessionLoaded(true);
      }
    }
    loadSession();
  }, []);

  // ── Debounced auto-save ────────────────────────────────
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sessionLoaded) return;

    const currentState = platform === "reddit" ? redditState : quoraState;
    const payload = {
      platform,
      targetKeyword: currentState.keyword,
      brandName: currentState.brand,
      websiteUrl: currentState.websiteUrl,
      targetAudience: currentState.audience,
      writingStyle: currentState.writingStyle,
      wordCount: currentState.wordCount,
      customWordCount: currentState.customWordCount,
      additionalInstructions: currentState.additionalInstructions,
      redditSubreddit: redditState.subreddit,
      redditObjective: redditState.postObjective,
      quoraQuestionType: quoraState.questionType,
      quoraAnswerDepth: quoraState.answerDepth,
      websitePlacement: currentState.websitePlacement,
      brandMention: currentState.brandMention,
      callToAction: currentState.callToAction,
      generatedTitle: title,
      generatedBody: body,
    };

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) setSyncError(false);
        else setSyncError(true);
      } catch {
        setSyncError(true);
      }
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [platform, redditState, quoraState, title, body, sessionLoaded]);

  // ── Helpers ────────────────────────────────────────────
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

  function buildHistoryPayload(generatedTitle: string, generatedBody: string) {
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
      subreddit: redditState.subreddit,
      postObjective: redditState.postObjective,
      questionType: quoraState.questionType,
      answerDepth: quoraState.answerDepth,
      title: generatedTitle,
      body: generatedBody,
    };
  }

  async function saveHistory(generatedTitle: string, generatedBody: string) {
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildHistoryPayload(generatedTitle, generatedBody)),
      });
    } catch {
      // Best-effort — don't block UX
    }
  }

  // ── Generate handlers ──────────────────────────────────
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

    try {
      const data = await callGenerate({ platform, ...cur, mode: "all" });
      setTitle(data.title);
      setBody(data.body);
      if (data.title || data.body) {
        await saveHistory(data.title, data.body);
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
    try {
      const data = await callGenerate({ platform, ...cur, mode: "title", existingBody: body });
      setTitle(data.title);
      await saveHistory(data.title, body);
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
    try {
      const data = await callGenerate({ platform, ...cur, mode: "post", existingTitle: title });
      setBody(data.body);
      await saveHistory(title, data.body);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleRestore = (entry: HistoryEntry) => {
    const p = entry.platform;
    setPlatform(p);
    const common: CommonState = {
      keyword: entry.keyword ?? "",
      brand: entry.brand ?? "",
      websiteUrl: entry.websiteUrl ?? "",
      audience: entry.audience ?? "",
      writingStyle: (entry.writingStyle as WritingStyle) || "natural-human",
      wordCount: (entry.wordCount as WordCountOption) || "300",
      customWordCount: entry.customWordCount ?? "",
      additionalInstructions: entry.additionalInstructions ?? "",
    };
    if (p === "reddit") {
      setRedditState({
        ...common,
        subreddit: entry.subreddit ?? "",
        postObjective: (entry.postObjective as PostObjective) || "start-discussion",
        websitePlacement: (entry.websitePlacement as WebsitePlacement) || "none",
        brandMention: entry.brandMention ?? true,
        callToAction: (entry.callToAction as CallToAction) || "none",
      });
    } else {
      setQuoraState({
        ...common,
        questionType: (entry.questionType as QuestionType) || "how",
        answerDepth: (entry.answerDepth as AnswerDepth) || "detailed",
        websitePlacement: (entry.websitePlacement as WebsitePlacement) || "none",
        brandMention: entry.brandMention ?? true,
        callToAction: (entry.callToAction as CallToAction) || "none",
      });
    }
    setTitle(entry.title);
    setBody(entry.body);
    setHasGenerated(true);
    setError("");
  };

  // ── Loading screen ─────────────────────────────────────
  if (!sessionLoaded) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8F9FB] gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] border-t-[#9CA3AF] animate-spin" />
        <p className="text-[14px] font-medium text-[#9CA3AF]">Loading Session...</p>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────
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
                      onChange={(u) => setRedditState((p) => ({ ...p, ...u }))}
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
                      onChange={(u) => setQuoraState((p) => ({ ...p, ...u }))}
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

              {syncError && (
                <p className="text-[12px] text-red-400 text-center -mt-1">
                  Unable to sync — working locally.
                </p>
              )}
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
