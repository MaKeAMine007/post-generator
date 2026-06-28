import { Copy } from "lucide-react";

interface OutputCardProps {
  content: string;
}

export default function OutputCard({ content }: OutputCardProps) {
  const isEmpty = !content;

  return (
    <div className="space-y-3">
      <label className="text-[13px] font-medium text-[#888888] uppercase tracking-wider">
        Output
      </label>
      <div className="relative rounded-lg border border-[#202020] bg-[#0d0d0d] min-h-[200px]">
        <button
          className="
            absolute top-3 right-3
            p-2 rounded-md
            text-[#555555] hover:text-[#888888]
            hover:bg-[#1a1a1a]
            transition-colors duration-150
            cursor-default
          "
          aria-label="Copy to clipboard"
        >
          <Copy size={14} strokeWidth={2} />
        </button>
        <div className="p-4 pr-12 min-h-[200px] flex items-start">
          {isEmpty ? (
            <span className="font-mono text-[14px] text-[#444444] leading-relaxed">
              Generated content will appear here.
            </span>
          ) : (
            <pre className="font-mono text-[14px] text-white leading-relaxed whitespace-pre-wrap break-words w-full">
              {content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
