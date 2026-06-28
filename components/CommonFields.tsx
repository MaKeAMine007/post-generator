"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CommonState } from "@/types/generator";

interface CommonFieldsProps {
  state: CommonState;
  onChange: (updates: Partial<CommonState>) => void;
  accentColor: string;
}

const writingStyleOptions = [
  { value: "natural-human", label: "Natural & Human" },
  { value: "professional", label: "Professional" },
  { value: "educational", label: "Educational" },
  { value: "storytelling", label: "Storytelling" },
  { value: "personal-experience", label: "Personal Experience" },
  { value: "conversational", label: "Conversational" },
  { value: "persuasive", label: "Persuasive" },
  { value: "curious", label: "Curious" },
  { value: "friendly", label: "Friendly" },
  { value: "analytical", label: "Analytical" },
  { value: "data-driven", label: "Data Driven" },
  { value: "minimal", label: "Minimal" },
  { value: "funny", label: "Funny" },
  { value: "inspirational", label: "Inspirational" },
];

const wordCountOptions = [
  { value: "150", label: "150 words" },
  { value: "300", label: "300 words" },
  { value: "500", label: "500 words" },
  { value: "700", label: "700 words" },
  { value: "1000", label: "1000 words" },
  { value: "custom", label: "Custom" },
];

const inputStyle = (focused: boolean, accentColor: string) => ({
  borderColor: focused ? accentColor : "#E5E7EB",
  boxShadow: focused ? `0 0 0 3px ${accentColor}25` : "0 1px 2px rgba(0,0,0,0.04)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
});

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

const inputClass = "w-full rounded-[12px] border bg-white px-4 text-[16px] font-normal text-[#111827] placeholder:text-[#C4C9D4]";

export default function CommonFields({ state, onChange, accentColor }: CommonFieldsProps) {
  const [keywordFocused, setKeywordFocused] = useState(false);
  const [brandFocused, setBrandFocused] = useState(false);
  const [urlFocused, setUrlFocused] = useState(false);
  const [audienceFocused, setAudienceFocused] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [wordCountOpen, setWordCountOpen] = useState(false);
  const [customWcFocused, setCustomWcFocused] = useState(false);
  const [instructionsFocused, setInstructionsFocused] = useState(false);

  return (
    <>
      {/* Target Keyword */}
      <div className="space-y-2">
        <label className="block text-[14px] font-medium text-[#111827]">
          Target Keyword <span style={{ color: accentColor }}>*</span>
        </label>
        <textarea
          value={state.keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          onFocus={() => setKeywordFocused(true)}
          onBlur={() => setKeywordFocused(false)}
          placeholder="e.g. Best MBA colleges in Delhi"
          rows={2}
          style={inputStyle(keywordFocused, accentColor)}
          className={`${inputClass} py-3 resize-none leading-relaxed`}
        />
      </div>

      {/* Brand / Business Name */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[14px] font-medium text-[#111827]">
            Brand / Business Name
          </label>
          <span className="text-[12px] font-medium text-[#C4C9D4]">Optional</span>
        </div>
        <input
          type="text"
          value={state.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
          onFocus={() => setBrandFocused(true)}
          onBlur={() => setBrandFocused(false)}
          placeholder="e.g. ABC Institute, Nike, Tesla"
          style={{ height: "46px", ...inputStyle(brandFocused, accentColor) }}
          className={inputClass}
        />
      </div>

      {/* Website URL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[14px] font-medium text-[#111827]">
            Website URL
          </label>
          <span className="text-[12px] font-medium text-[#C4C9D4]">Optional</span>
        </div>
        <input
          type="url"
          value={state.websiteUrl}
          onChange={(e) => onChange({ websiteUrl: e.target.value })}
          onFocus={() => setUrlFocused(true)}
          onBlur={() => setUrlFocused(false)}
          placeholder="https://example.com"
          style={{ height: "46px", ...inputStyle(urlFocused, accentColor) }}
          className={inputClass}
        />
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[14px] font-medium text-[#111827]">
            Target Audience
          </label>
          <span className="text-[12px] font-medium text-[#C4C9D4]">Optional</span>
        </div>
        <input
          type="text"
          value={state.audience}
          onChange={(e) => onChange({ audience: e.target.value })}
          onFocus={() => setAudienceFocused(true)}
          onBlur={() => setAudienceFocused(false)}
          placeholder="e.g. Students, Founders, Developers"
          style={{ height: "46px", ...inputStyle(audienceFocused, accentColor) }}
          className={inputClass}
        />
      </div>

      {/* Writing Style */}
      <div className="space-y-2">
        <label className="block text-[14px] font-medium text-[#111827]">
          Writing Style
        </label>
        <Select
          value={state.writingStyle}
          onValueChange={(v) => v && onChange({ writingStyle: v as CommonState["writingStyle"] })}
          onOpenChange={setStyleOpen}
        >
          <SelectTrigger
            style={selectTriggerStyle(styleOpen, accentColor)}
            className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
          >
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent
            className="rounded-[12px] border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            sideOffset={6}
          >
            {writingStyleOptions.map((opt) => (
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

      {/* Word Count */}
      <div className="space-y-2">
        <label className="block text-[14px] font-medium text-[#111827]">
          Word Count
        </label>
        <Select
          value={state.wordCount}
          onValueChange={(v) => v && onChange({ wordCount: v as CommonState["wordCount"] })}
          onOpenChange={setWordCountOpen}
        >
          <SelectTrigger
            style={selectTriggerStyle(wordCountOpen, accentColor)}
            className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
          >
            <SelectValue placeholder="Select word count" />
          </SelectTrigger>
          <SelectContent
            className="rounded-[12px] border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            sideOffset={6}
          >
            {wordCountOptions.map((opt) => (
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

        {state.wordCount === "custom" && (
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#6B7280]">
              Custom Word Count
            </label>
            <input
              type="number"
              min="50"
              max="5000"
              step="1"
              value={state.customWordCount}
              onChange={(e) => onChange({ customWordCount: e.target.value })}
              onFocus={() => setCustomWcFocused(true)}
              onBlur={() => setCustomWcFocused(false)}
              placeholder="Enter number of words"
              style={{ height: "46px", ...inputStyle(customWcFocused, accentColor) }}
              className={inputClass}
            />
            <p className="text-[12px] text-[#9CA3AF]">Allowed range: 50–5000 words</p>
          </div>
        )}
      </div>

      {/* Additional Instructions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[14px] font-medium text-[#111827]">
            Additional Instructions
          </label>
          <span className="text-[12px] font-medium text-[#C4C9D4]">Optional</span>
        </div>
        <textarea
          value={state.additionalInstructions}
          onChange={(e) => onChange({ additionalInstructions: e.target.value })}
          onFocus={() => setInstructionsFocused(true)}
          onBlur={() => setInstructionsFocused(false)}
          placeholder={"Avoid sounding promotional.\nUse Indian English.\nWrite like a student.\nDon't use emojis."}
          rows={3}
          style={inputStyle(instructionsFocused, accentColor)}
          className={`${inputClass} py-3 resize-none leading-relaxed`}
        />
      </div>
    </>
  );
}
