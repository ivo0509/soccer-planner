"use client";

import Link from "next/link";
import { getCapacityLabel } from "@/lib/match-utils";
import type { MatchWithDetails } from "@/services/match-service";

interface MatchCardProps {
  match: MatchWithDetails;
}

const STATE_LABELS: Record<string, string> = {
  upcoming: "Upcoming",
  current: "Current",
  past: "Past",
};

const STATE_BADGE_COLORS: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-800",
  current: "bg-green-100 text-green-800",
  past: "bg-gray-100 text-gray-800",
};

const CAPACITY_COLORS: Record<string, string> = {
  full: "text-orange-600",
  over: "text-red-600 font-semibold",
  under: "text-green-600",
};

export function MatchCard({ match }: MatchCardProps) {
  const capacityLabel = getCapacityLabel(match.capacityStatus);

  const cardBg = match.canceled
    ? "bg-gray-100 border-gray-300"
    : match.state === "upcoming"
    ? "bg-blue-50 border-blue-200"
    : match.state === "current"
    ? "bg-green-50 border-green-200"
    : "bg-gray-50 border-gray-200";

  const capacityColor = CAPACITY_COLORS[match.capacityStatus] ?? "text-gray-600";

  return (
    <Link href={`/matches/${match.id}`}>
      <div
        className={`border-2 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer active:shadow-md ${cardBg}`}
      >
        {/* Header: date/time + state badges */}
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="min-w-0 flex-shrink-0">
            <p className="text-xs sm:text-sm text-gray-600">
              {match.date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">{match.time}</p>
          </div>
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            <span
              className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATE_BADGE_COLORS[match.state]}`}
            >
              {STATE_LABELS[match.state]}
            </span>
            {match.canceled && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 whitespace-nowrap">
                Canceled
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <p className="text-sm sm:text-base text-gray-700 mb-3 truncate">
          <span className="font-semibold">📍</span> {match.location}
        </p>

        {/* Group */}
        <p className="text-xs sm:text-sm text-gray-600 mb-4 truncate">
          <span className="text-gray-500">Group:</span> {match.groupTitle}
        </p>

        {/* Players + capacity / Comments */}
        <div className="flex justify-between items-center gap-3 text-xs sm:text-sm">
          <div className="min-w-0">
            <p className={`font-medium ${capacityColor}`}>
              {match.playerCount}/{match.capacity}
            </p>
            <p className="text-gray-500 text-xs">{capacityLabel}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-medium text-gray-700">
              💬 {match.commentCount}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
