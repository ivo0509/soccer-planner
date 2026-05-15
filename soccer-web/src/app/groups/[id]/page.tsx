import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getGroupById } from "@/services/group-service";
import { GroupMembersCard } from "@/app/components/GroupMembersCard";

interface GroupDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const groupId = parseInt(id, 10);

  if (isNaN(groupId)) {
    notFound();
  }

  const group = await getGroupById(groupId);

  if (!group) {
    notFound();
  }

  // Check if user is a member of this group
  const isMember = group.members.some((m) => m.userId === user.id);

  if (!isMember) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
            <Link
              href="/groups"
              className="text-blue-600 hover:text-blue-700 font-medium mb-3 inline-block text-sm sm:text-base"
            >
              ← Back to Groups
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{group.title}</h1>
          </div>
        </div>

        {/* Error Message */}
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-sm sm:text-base text-red-700 mb-4">
              You are not a member of this group. Only members can view group details.
            </p>
            <Link
              href="/groups"
              className="inline-block px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base"
            >
              Back to Groups
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userMember = group.members.find((m) => m.userId === user.id);
  const isManager = userMember?.isManager ?? false;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <Link
            href="/groups"
            className="text-blue-600 hover:text-blue-700 font-medium mb-3 inline-block text-sm sm:text-base"
          >
            ← Back to Groups
          </Link>
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {group.title}
              </h1>
              {group.description && (
                <p className="text-sm sm:text-base text-gray-600 mt-2">{group.description}</p>
              )}
            </div>
            {isManager && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0">
                👑 You are a Manager
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <GroupMembersCard
          groupTitle={group.title}
          members={group.members}
          memberCount={group.memberCount}
          managerCount={group.managerCount}
        />
      </div>
    </div>
  );
}
