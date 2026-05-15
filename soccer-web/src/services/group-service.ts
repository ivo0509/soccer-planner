import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { groups, groupMembers, users } from "@/db/schema";

export interface GroupWithDetails {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  managerCount: number;
  members: Array<{
    id: number;
    userId: number;
    userName: string;
    email: string;
    isManager: boolean;
    joinedAt: Date;
  }>;
}

/**
 * Get a single group with full details including members and their manager status
 */
export async function getGroupById(groupId: number): Promise<GroupWithDetails | null> {
  const [groupData] = await db
    .select()
    .from(groups)
    .where(eq(groups.id, groupId))
    .limit(1);

  if (!groupData) {
    return null;
  }

  // Get all members of this group
  const members = await db
    .select({
      id: groupMembers.id,
      userId: users.id,
      userName: users.name,
      email: users.email,
      isManager: groupMembers.isManager,
      joinedAt: groupMembers.joinedAt,
    })
    .from(groupMembers)
    .innerJoin(users, eq(groupMembers.userId, users.id))
    .where(eq(groupMembers.groupId, groupId))
    .orderBy(groupMembers.joinedAt);

  const memberCount = members.length;
  const managerCount = members.filter((m) => m.isManager).length;

  return {
    id: groupData.id,
    title: groupData.title,
    description: groupData.description,
    createdAt: groupData.createdAt,
    updatedAt: groupData.updatedAt,
    memberCount,
    managerCount,
    members,
  };
}

/**
 * Get all groups for a user with member counts
 */
export async function getUserGroups(userId: number) {
  // Get all groups for this user
  const userGroupsData = await db
    .select({
      id: groups.id,
      title: groups.title,
      description: groups.description,
      createdAt: groups.createdAt,
      updatedAt: groups.updatedAt,
    })
    .from(groupMembers)
    .innerJoin(groups, eq(groupMembers.groupId, groups.id))
    .where(eq(groupMembers.userId, userId));

  // For each group, count members and managers
  const enrichedGroups = await Promise.all(
    userGroupsData.map(async (group) => {
      const members = await db
        .select({ id: groupMembers.id, isManager: groupMembers.isManager })
        .from(groupMembers)
        .where(eq(groupMembers.groupId, group.id));

      const managerCount = members.filter((m) => m.isManager).length;

      return {
        id: group.id,
        title: group.title,
        description: group.description,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        memberCount: members.length,
        managerCount,
      };
    })
  );

  return enrichedGroups;
}

/**
 * Update manager status for a group member
 */
export async function updateMemberManagerStatus(
  groupId: number,
  userId: number,
  isManager: boolean
) {
  await db
    .update(groupMembers)
    .set({ isManager })
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)));
}
