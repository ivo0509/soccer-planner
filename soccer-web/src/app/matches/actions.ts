"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMatchById, joinMatch, unjoinMatch } from "@/services/match-service";

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
