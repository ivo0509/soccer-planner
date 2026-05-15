import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserGroups } from "@/services/group-service";

export default async function GroupsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const groups = await getUserGroups(user.id);

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Groups</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              You haven't joined any groups yet.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 sm:p-8 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                      ⚽ {group.title}
                    </h2>
                  </div>
                </div>

                {group.description && (
                  <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">
                    {group.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Members</p>
                    <p className="font-bold text-blue-600">{group.memberCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Managers</p>
                    <p className="font-bold text-purple-600">{group.managerCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Created</p>
                    <p className="font-bold text-gray-700">
                      {group.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
