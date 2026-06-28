"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToneSelectorProps {
  value: string;
  onChange: (value: string | null) => void;
  accentColor: string;
}

const tones = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "funny", label: "Funny" },
  { value: "educational", label: "Educational" },
  { value: "persuasive", label: "Persuasive" },
];

export default function ToneSelector({ value, onChange, accentColor }: ToneSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-[14px] font-medium text-[#111827]">
        Tone
      </label>
      <Select value={value} onValueChange={onChange} onOpenChange={setOpen}>
        <SelectTrigger
          style={{
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
          }}
          className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
        >
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent
          className="rounded-[12px] border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          sideOffset={6}
        >
          {tones.map((tone) => (
            <SelectItem
              key={tone.value}
              value={tone.value}
              className="text-[14px] font-normal text-[#111827] focus:bg-[#F3F4F6] focus:text-[#111827] cursor-pointer rounded-[8px] py-2"
            >
              {tone.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
