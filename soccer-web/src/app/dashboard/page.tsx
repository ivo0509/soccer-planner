import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getActiveMatches, getArchivedMatches } from "@/services/match-service";
import { MatchCard } from "@/app/components/MatchCard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const activeMatches = await getActiveMatches(user.id);
  const archivedMatches = await getArchivedMatches(user.id);

  return (
    <div className="flex-1 bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-700">
            Welcome back, <span className="font-semibold">{user.name}</span>!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Active Matches Section */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            ⚽ Active Matches
          </h2>

          {activeMatches.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                No active matches right now. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {activeMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </section>

        {/* Archive Matches Section */}
        {archivedMatches.length > 0 && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              📋 Archive
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Past and canceled matches ({archivedMatches.length})
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {archivedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
