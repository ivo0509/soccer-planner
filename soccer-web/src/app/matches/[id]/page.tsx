import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMatchById, isUserGroupMember } from "@/services/match-service";
import { getCapacityLabel } from "@/lib/match-utils";
import { joinMatchAction, unjoinMatchAction } from "../actions";
import { ShareMatchButton } from "@/app/components/ShareMatchButton";
import { ExtraSlotsEditor } from "@/app/components/ExtraSlotsEditor";

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

const STATE_BORDER: Record<string, string> = {
  upcoming: "border-blue-200",
  current: "border-green-200",
  past: "border-gray-200",
};

interface MatchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const matchId = parseInt(id, 10);
  if (isNaN(matchId)) {
    notFound();
  }

  const match = await getMatchById(matchId, user.id);

  if (!match) {
    notFound();
  }

  // Check if user is a member of the group that owns this match
  const isMember = await isUserGroupMember(match.groupId, user.id);

  if (!isMember) {
    // User is not a member of the group, show error
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700 font-medium mb-3 inline-block text-sm sm:text-base"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Match Details</h1>
          </div>
        </div>

        {/* Error Message */}
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-sm sm:text-base text-red-700 mb-4">
              You are not a member of the group that owns this match. Only group members can view match details.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const capacityLabel = getCapacityLabel(match.capacityStatus);
  const borderColor = STATE_BORDER[match.state] ?? "border-gray-200";

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium mb-3 inline-block text-sm sm:text-base"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Match Details</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Match Card */}
        <div
          className={`border-2 rounded-lg p-6 sm:p-8 mb-6 sm:mb-8 bg-white ${borderColor}`}
        >
          {/* Title and State */}
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
                {match.groupTitle}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {match.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at {match.time}
              </p>
            </div>
            <div className="flex flex-col gap-1 items-end flex-shrink-0">
              <span
                className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${STATE_BADGE_COLORS[match.state]}`}
              >
                {STATE_LABELS[match.state]}
              </span>
              {match.canceled && (
                <span className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold bg-red-100 text-red-800 whitespace-nowrap">
                  Canceled
                </span>
              )}
            </div>
          </div>

          {/* Match Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
            {/* Location */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                📍 Location
              </h3>
              <p className="text-base sm:text-lg text-gray-900 break-words">{match.location}</p>
            </div>

            {/* Capacity */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                👥 Players
              </h3>
              <p className="text-base sm:text-lg text-gray-900">
                {match.playerCount} / {match.capacity}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">{capacityLabel}</p>
            </div>

            {/* Time Details */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                ⏰ Time
              </h3>
              <p className="text-base sm:text-lg text-gray-900">{match.time}</p>
            </div>

            {/* Group */}
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                ⚽ Group
              </h3>
              <p className="text-base sm:text-lg text-gray-900 break-words">{match.groupTitle}</p>
            </div>
          </div>

          {/* Canceled Notice */}
          {match.canceled && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-xs sm:text-sm text-red-800 font-medium">
                ⚠️ This match has been canceled and will not be played.
              </p>
            </div>
          )}

          {/* Join / Unjoin */}
          {match.isActive && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {match.isJoined ? (
                  <form action={unjoinMatchAction.bind(null, match.id)}>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition text-sm sm:text-base"
                    >
                      Leave Match
                    </button>
                  </form>
                ) : (
                  <form action={joinMatchAction.bind(null, match.id)}>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition text-sm sm:text-base"
                    >
                      Join Match
                    </button>
                  </form>
                )}
                <ShareMatchButton matchId={match.id} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                {match.isJoined ? "You are in this match." : "You have not joined yet."}
              </p>
            </div>
          )}

          {/* Extra Slots Editor - Only show when user is joined */}
          {match.isActive && match.isJoined && (
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <ExtraSlotsEditor
                matchId={match.id}
                currentSlots={match.players.find((p) => p.id === user.id)?.extraSlots ?? 0}
              />
            </div>
          )}
        </div>

        {/* Players Section */}
        <section className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
            Players Joined ({match.players.length})
          </h3>

          {match.players.length === 0 ? (
            <p className="text-sm sm:text-base text-gray-600">No one has joined this match yet.</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {match.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{player.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{player.email}</p>
                  </div>
                  {player.extraSlots > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                      +{player.extraSlots} slot{player.extraSlots > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Comments Section */}
        <section className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
            Comments ({match.commentCount})
          </h3>

          {match.comments.length === 0 ? (
            <p className="text-sm sm:text-base text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {match.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-l-4 border-blue-400 bg-gray-50 p-3 sm:p-4 rounded"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {comment.userName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                      {comment.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {comment.createdAt.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 break-words">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
