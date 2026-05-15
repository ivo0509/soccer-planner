"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getMatchById, joinMatch, unjoinMatch, updateExtraSlots } from "@/services/match-service";

export async function joinMatchAction(matchId: number, _formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const match = await getMatchById(matchId, user.id);

  if (!match) {
    return;
  }

  if (!match.isActive) {
    return;
  }

  await joinMatch(matchId, user.id);
  redirect(`/matches/${matchId}`);
}

export async function unjoinMatchAction(matchId: number, _formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const match = await getMatchById(matchId, user.id);

  if (!match) {
    return;
  }

  if (!match.isActive) {
    return;
  }

  await unjoinMatch(matchId, user.id);
  redirect(`/matches/${matchId}`);
}

export async function updateExtraSlotsAction(
  matchId: number,
  extraSlots: number
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const match = await getMatchById(matchId, user.id);

  if (!match) {
    return { success: false, error: "Match not found" };
  }

  if (!match.isActive) {
    return { success: false, error: "Match is not active" };
  }

  if (!match.isJoined) {
    return { success: false, error: "You must be joined to update slots" };
  }

  await updateExtraSlots(matchId, user.id, extraSlots);
  revalidatePath(`/matches/${matchId}`);
  return { success: true };
}
