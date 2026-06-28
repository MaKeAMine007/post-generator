"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RedditState } from "@/types/generator";

export type { RedditState };

interface RedditFieldsProps {
  state: RedditState;
  onChange: (updates: Partial<RedditState>) => void;
  accentColor: string;
}

const postObjectiveOptions = [
  { value: "ask-question", label: "Ask Question" },
  { value: "start-discussion", label: "Start Discussion" },
  { value: "share-experience", label: "Share Experience" },
  { value: "tell-story", label: "Tell a Story" },
  { value: "give-advice", label: "Give Advice" },
  { value: "comparison", label: "Comparison" },
  { value: "recommendation", label: "Recommendation" },
  { value: "guide", label: "Guide" },
  { value: "ama-style", label: "AMA Style" },
  { value: "opinion", label: "Opinion" },
  { value: "success-story", label: "Success Story" },
  { value: "failure-story", label: "Failure Story" },
  { value: "case-study", label: "Case Study" },
  { value: "request-feedback", label: "Request Feedback" },
];

const placementOptions = [
  { value: "none", label: "Do Not Mention" },
  { value: "brand-only", label: "Mention Brand Only" },
  { value: "mention-naturally", label: "Mention Website Naturally" },
  { value: "direct-url-once", label: "Include Direct URL Once" },
  { value: "direct-url-twice", label: "Include Direct URL Twice" },
];

const ctaOptions = [
  { value: "none", label: "None" },
  { value: "soft", label: "Soft" },
  { value: "moderate", label: "Moderate" },
  { value: "strong", label: "Strong" },
];

const selectTriggerStyle = (open: boolean, accentColor: string) => ({
  height: "48px",
  borderRadius: "12px",
  backgroundColor: "white",
  borderColor: open ? accentColor : "#E5E7EB",
  boxShadow: open ? `0 0 0 3px ${accentColor}25` : "0 1px 2px rgba(0,0,0,0.04)",
  color: "#111827",
  fontSize: "16px",
  fontWeight: "400",
  paddingLeft: "16px",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
});

export default function RedditFields({ state, onChange, accentColor }: RedditFieldsProps) {
  const [subredditFocused, setSubredditFocused] = useState(false);
  const [objectiveOpen, setObjectiveOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);

  return (
    <>
      {/* Target Subreddit */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[14px] font-medium text-[#111827]">
            Target Subreddit
          </label>
          <span className="text-[12px] font-medium text-[#C4C9D4]">Optional</span>
        </div>
        <input
          type="text"
          value={state.subreddit}
          onChange={(e) => onChange({ subreddit: e.target.value })}
          onFocus={() => setSubredditFocused(true)}
          onBlur={() => setSubredditFocused(false)}
          placeholder="e.g. r/IndianAcademia, r/Entrepreneur"
          style={{
            height: "46px",
            borderColor: subredditFocused ? accentColor : "#E5E7EB",
            boxShadow: subredditFocused ? `0 0 0 3px ${accentColor}25` : "0 1px 2px rgba(0,0,0,0.04)",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            fontFamily: "inherit",
          }}
          className="w-full rounded-[12px] border bg-white px-4 text-[16px] font-normal text-[#111827] placeholder:text-[#C4C9D4]"
        />
      </div>

      {/* Post Objective */}
      <div className="space-y-2">
        <label className="block text-[14px] font-medium text-[#111827]">
          Post Objective
        </label>
        <Select
          value={state.postObjective}
          onValueChange={(v) => v && onChange({ postObjective: v as RedditState["postObjective"] })}
          onOpenChange={setObjectiveOpen}
        >
          <SelectTrigger
            style={selectTriggerStyle(objectiveOpen, accentColor)}
            className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
          >
            <SelectValue placeholder="Select objective" />
          </SelectTrigger>
          <SelectContent
            className="rounded-[12px] border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            sideOffset={6}
          >
            {postObjectiveOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-[14px] font-normal text-[#111827] focus:bg-[#F3F4F6] focus:text-[#111827] cursor-pointer rounded-[8px] py-2"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Website Placement + Brand Mention */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-[14px] font-medium text-[#111827]">
            Website Placement
          </label>
          <Select
            value={state.websitePlacement}
            onValueChange={(v) => v && onChange({ websitePlacement: v as RedditState["websitePlacement"] })}
            onOpenChange={setPlacementOpen}
          >
            <SelectTrigger
              style={selectTriggerStyle(placementOpen, accentColor)}
              className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent
              className="rounded-[12px] border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              sideOffset={6}
            >
              {placementOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-[14px] font-normal text-[#111827] focus:bg-[#F3F4F6] focus:text-[#111827] cursor-pointer rounded-[8px] py-2"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-[14px] font-medium text-[#111827]">
            Brand Mention
          </label>
          <div
            className="flex rounded-[12px] border border-[#E5E7EB] overflow-hidden"
            style={{ height: "48px" }}
          >
            <button
              type="button"
              onClick={() => onChange({ brandMention: true })}
              className="flex-1 text-[14px] font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: state.brandMention ? accentColor : "white",
                color: state.brandMention ? "white" : "#6B7280",
              }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onChange({ brandMention: false })}
              className="flex-1 text-[14px] font-medium transition-colors cursor-pointer border-l border-[#E5E7EB]"
              style={{
                backgroundColor: !state.brandMention ? accentColor : "white",
                color: !state.brandMention ? "white" : "#6B7280",
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="space-y-2">
        <label className="block text-[14px] font-medium text-[#111827]">
          Call To Action
        </label>
        <Select
          value={state.callToAction}
          onValueChange={(v) => v && onChange({ callToAction: v as RedditState["callToAction"] })}
          onOpenChange={setCtaOpen}
        >
          <SelectTrigger
            style={selectTriggerStyle(ctaOpen, accentColor)}
            className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
          >
            <SelectValue placeholder="Select CTA" />
          </SelectTrigger>
          <SelectContent
            className="rounded-[12px] border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            sideOffset={6}
          >
            {ctaOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-[14px] font-normal text-[#111827] focus:bg-[#F3F4F6] focus:text-[#111827] cursor-pointer rounded-[8px] py-2"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
