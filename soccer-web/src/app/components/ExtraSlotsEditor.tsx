"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateExtraSlotsAction } from "../matches/actions";

interface ExtraSlotsEditorProps {
  matchId: number;
  currentSlots: number;
}

export function ExtraSlotsEditor({ matchId, currentSlots }: ExtraSlotsEditorProps) {
  const router = useRouter();
  const [slots, setSlots] = useState(currentSlots);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleIncrement = async () => {
    if (slots >= 2) return;
    const newSlots = slots + 1;
    setSlots(newSlots);
    await saveSlots(newSlots);
  };

  const handleDecrement = async () => {
    if (slots <= 0) return;
    const newSlots = slots - 1;
    setSlots(newSlots);
    await saveSlots(newSlots);
  };

  const saveSlots = async (newSlots: number) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateExtraSlotsAction(matchId, newSlots);
      if (result.success) {
        setSuccess(true);
        // Refresh the page to show updated player count
        setTimeout(() => router.refresh(), 500);
      } else {
        setError(result.error || "Failed to update slots");
        setSlots(currentSlots);
      }
    } catch (err) {
      setError("An error occurred");
      setSlots(currentSlots);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
      <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-3 sm:mb-4">
        Extra Slots for Friends
      </h4>
      <p className="text-xs sm:text-sm text-blue-700 mb-4">
        Reserve additional spots for friends (0-2 slots). Each slot counts as one extra player.
      </p>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={handleDecrement}
          disabled={slots === 0 || isLoading}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-blue-300 rounded-lg font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
        >
          −
        </button>

        <div className="flex items-center gap-2 sm:gap-3 min-w-[60px]">
          <span className="text-lg sm:text-xl font-bold text-blue-900">{slots}</span>
          <span className="text-xs sm:text-sm text-blue-700">slot{slots !== 1 ? "s" : ""}</span>
        </div>

        <button
          onClick={handleIncrement}
          disabled={slots === 2 || isLoading}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-blue-300 rounded-lg font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
        >
          +
        </button>
      </div>

      {error && (
        <p className="text-xs sm:text-sm text-red-600 mt-3 sm:mt-4">{error}</p>
      )}
      {success && (
        <p className="text-xs sm:text-sm text-green-600 mt-3 sm:mt-4">✓ Updated successfully</p>
      )}
    </div>
  );
}
