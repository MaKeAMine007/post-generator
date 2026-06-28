"use client";

interface EditablePostProps {
  value: string;
  onChange: (value: string) => void;
  accentColor: string;
}

export default function EditablePost({ value, onChange, accentColor }: EditablePostProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Post will appear here"
      style={{
        fontFamily: "inherit",
        resize: "none",
        caretColor: accentColor,
      }}
      className="
        w-full h-full bg-transparent border-none outline-none
        text-[16px] font-normal text-[#374151] leading-[1.7]
        placeholder:text-[#D1D5DB] whitespace-pre-wrap overflow-y-auto
      "
    />
  );
}
