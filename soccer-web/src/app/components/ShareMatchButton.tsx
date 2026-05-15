"use client";

import { useState } from "react";

interface ShareMatchButtonProps {
  matchId: number;
}

export function ShareMatchButton({ matchId }: ShareMatchButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const matchUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/matches/${matchId}`;

    try {
      await navigator.clipboard.writeText(matchUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 sm:px-6 py-2 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-700 transition text-sm sm:text-base"
      title="Copy match link to clipboard"
    >
      {copied ? "✓ Copied!" : "📤 Share Link"}
    </button>
  );
}
