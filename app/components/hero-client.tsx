"use client";

import { useState } from "react";

type Props = {
  onGetStarted: () => void;
};

const durations = ["30 min", "1 hour", "2 hours", "6 hours", "1 day", "1 week"];

// Inline SVGs for critical above-fold icons (avoids Lucide bundle)
function DropletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default function HeroClient({ onGetStarted }: Props) {
  const [duration, setDuration] = useState("1 hour");

  const handleStart = () => {
    // Lazy load analytics only when needed
    import("@/lib/analytics").then(({ trackEvent }) => {
      trackEvent("hero_cta_click", { duration });
    });
    onGetStarted();
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl shadow-black/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800/50 px-5 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <DropletIcon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Add to Google Docs</p>
              <p className="text-xs text-gray-400">Your text will appear gradually over time</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Text Area */}
        <div className="p-5">
          <textarea
            placeholder="Paste your essay, assignment, or any text here..."
            rows={5}
            className="w-full bg-transparent text-white placeholder:text-gray-600 outline-none resize-none text-base leading-relaxed"
          />
        </div>

        {/* Duration Selection */}
        <div className="px-5 py-3 border-t border-gray-800 bg-gray-800/30">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Duration:</span>
            <div className="flex flex-wrap gap-2">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    duration === d
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 text-sm">
              <PlusIcon className="w-4 h-4" />
              Upload file
            </button>
            <span className="text-xs text-gray-400">.txt, .docx, .pdf</span>
          </div>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-semibold text-sm"
          >
            Start Scheduling
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Helper Text */}
      <p className="mt-4 text-sm text-gray-400">
        Text will be written to a new Google Doc sentence by sentence over your chosen duration
      </p>
    </div>
  );
}
