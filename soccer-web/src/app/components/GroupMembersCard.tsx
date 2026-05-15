"use client";

interface GroupMember {
  id: number;
  userId: number;
  userName: string;
  email: string;
  isManager: boolean;
  joinedAt: Date;
}

interface GroupMembersCardProps {
  groupTitle: string;
  members: GroupMember[];
  memberCount: number;
  managerCount: number;
}

export function GroupMembersCard({
  groupTitle,
  members,
  memberCount,
  managerCount,
}: GroupMembersCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          👥 Group Members
        </h3>
        <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
          <div>
            <p className="text-gray-600">Total Members</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{memberCount}</p>
          </div>
          <div>
            <p className="text-gray-600">Managers</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{managerCount}</p>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <p className="text-sm sm:text-base text-gray-600">No members in this group yet.</p>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {member.userName}
                  </p>
                  {member.isManager && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0">
                      👑 Manager
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{member.email}</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 flex-shrink-0 whitespace-nowrap">
                Joined {member.joinedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
