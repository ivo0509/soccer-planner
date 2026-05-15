import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/db";
import { matches, matchJoins, groups, users, groupMembers, matchComments } from "@/db/schema";
import {
  getMatchState,
  isMatchActive,
  getCapacityStatus,
  type MatchState,
  type CapacityStatus,
} from "@/lib/match-utils";

export interface MatchWithDetails {
  id: number;
  groupId: number;
  groupTitle: string;
  date: Date;
  time: string;
  location: string;
  capacity: number;
  canceled: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields
  state: MatchState;
  isActive: boolean;
  isJoined: boolean;
  playerCount: number;
  capacityStatus: CapacityStatus;
  players: Array<{
    id: number;
    name: string;
    email: string;
    extraSlots: number;
  }>;
  comments: Array<{
    id: number;
    userId: number;
    userName: string;
    text: string;
    createdAt: Date;
  }>;
  commentCount: number;
}

/**
 * Get all matches for a user's groups with full details
 */
export async function getUserMatches(userId: number) {
  // First, get all group IDs that the user is a member of
  const userGroupsData = await db
    .select({ groupId: groupMembers.groupId })
    .from(groupMembers)
    .where(eq(groupMembers.userId, userId));

  const groupIds = userGroupsData.map((g) => g.groupId);

  if (groupIds.length === 0) {
    return [];
  }

  // Get all matches for these groups
  const matchList = await db
    .select({
      match: matches,
      groupTitle: groups.title,
    })
    .from(matches)
    .innerJoin(groups, eq(matches.groupId, groups.id))
    .where(inArray(matches.groupId, groupIds));

  // Enrich each match with details
  const enrichedMatches: MatchWithDetails[] = [];

  for (const { match, groupTitle } of matchList) {
    const state = getMatchState(match.date, match.time);
    const isActive = isMatchActive(state, match.canceled);

    // Get players who joined this match
    const joinedPlayers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        extraSlots: matchJoins.extraSlots,
      })
      .from(matchJoins)
      .innerJoin(users, eq(matchJoins.userId, users.id))
      .where(eq(matchJoins.matchId, match.id));

    const playerCount = joinedPlayers.reduce(
      (sum, p) => sum + 1 + (p.extraSlots ?? 0),
      0
    );
    const capacityStatus = getCapacityStatus(playerCount, match.capacity);
    const isJoined = joinedPlayers.some((p) => p.id === userId);

    // Get comments for this match
    const comments = await db
      .select({
        id: matchComments.id,
        userId: matchComments.userId,
        userName: users.name,
        text: matchComments.text,
        createdAt: matchComments.createdAt,
      })
      .from(matchComments)
      .innerJoin(users, eq(matchComments.userId, users.id))
      .where(eq(matchComments.matchId, match.id))
      .orderBy(matchComments.createdAt);

    enrichedMatches.push({
      id: match.id,
      groupId: match.groupId,
      groupTitle,
      date: match.date,
      time: match.time,
      location: match.location,
      capacity: match.capacity,
      canceled: match.canceled,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
      state,
      isActive,
      isJoined,
      playerCount,
      capacityStatus,
      players: joinedPlayers,
      comments,
      commentCount: comments.length,
    });
  }

  return enrichedMatches;
}

/**
 * Get active matches for a user (upcoming or current, not canceled)
 */
export async function getActiveMatches(userId: number) {
  const allMatches = await getUserMatches(userId);
  return allMatches
    .filter((m) => m.isActive)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Get archived matches for a user (past or canceled)
 */
export async function getArchivedMatches(userId: number) {
  const allMatches = await getUserMatches(userId);
  return allMatches
    .filter((m) => !m.isActive)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Get a single match with full details
 */
export async function getMatchById(
  matchId: number,
  viewingUserId?: number
): Promise<MatchWithDetails | null> {
  const [matchData] = await db
    .select({
      match: matches,
      groupTitle: groups.title,
    })
    .from(matches)
    .innerJoin(groups, eq(matches.groupId, groups.id))
    .where(eq(matches.id, matchId))
    .limit(1);

  if (!matchData) {
    return null;
  }

  const { match, groupTitle } = matchData;
  const state = getMatchState(match.date, match.time);
  const isActive = isMatchActive(state, match.canceled);

  // Get players
  const joinedPlayers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      extraSlots: matchJoins.extraSlots,
    })
    .from(matchJoins)
    .innerJoin(users, eq(matchJoins.userId, users.id))
    .where(eq(matchJoins.matchId, match.id));

  const playerCount = joinedPlayers.reduce(
    (sum, p) => sum + 1 + (p.extraSlots ?? 0),
    0
  );
  const capacityStatus = getCapacityStatus(playerCount, match.capacity);
  const isJoined = viewingUserId != null
    ? joinedPlayers.some((p) => p.id === viewingUserId)
    : false;

  // Get comments for this match
  const comments = await db
    .select({
      id: matchComments.id,
      userId: matchComments.userId,
      userName: users.name,
      text: matchComments.text,
      createdAt: matchComments.createdAt,
    })
    .from(matchComments)
    .innerJoin(users, eq(matchComments.userId, users.id))
    .where(eq(matchComments.matchId, match.id))
    .orderBy(matchComments.createdAt);

  return {
    id: match.id,
    groupId: match.groupId,
    groupTitle,
    date: match.date,
    time: match.time,
    location: match.location,
    capacity: match.capacity,
    canceled: match.canceled,
    createdAt: match.createdAt,
    updatedAt: match.updatedAt,
    state,
    isActive,
    isJoined,
    playerCount,
    capacityStatus,
    players: joinedPlayers,
    comments,
    commentCount: comments.length,
  };
}

/**
 * Join a match. No-op if already joined.
 */
export async function joinMatch(matchId: number, userId: number) {
  const [existing] = await db
    .select({ id: matchJoins.id })
    .from(matchJoins)
    .where(and(eq(matchJoins.matchId, matchId), eq(matchJoins.userId, userId)))
    .limit(1);

  if (existing) return;

  await db.insert(matchJoins).values({ matchId, userId, extraSlots: 0 });
}

/**
 * Unjoin a match.
 */
export async function unjoinMatch(matchId: number, userId: number) {
  await db
    .delete(matchJoins)
    .where(and(eq(matchJoins.matchId, matchId), eq(matchJoins.userId, userId)));
}

/**
 * Check if a user is a member of a group.
 */
export async function isUserGroupMember(groupId: number, userId: number): Promise<boolean> {
  const [member] = await db
    .select({ id: groupMembers.id })
    .from(groupMembers)
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)))
    .limit(1);

  return !!member;
}

/**
 * Update the extra slots for a user in a match (0-2 slots).
 */
export async function updateExtraSlots(
  matchId: number,
  userId: number,
  extraSlots: number
) {
  // Clamp extraSlots to 0-2 range
  const clampedSlots = Math.max(0, Math.min(2, extraSlots));

  await db
    .update(matchJoins)
    .set({ extraSlots: clampedSlots })
    .where(and(eq(matchJoins.matchId, matchId), eq(matchJoins.userId, userId)));
}
