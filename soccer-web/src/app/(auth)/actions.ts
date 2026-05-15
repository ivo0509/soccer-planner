"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, setSessionCookie } from "@/lib/auth";
import { authenticateUser, registerUser } from "@/services/user-service";

export type AuthActionState = {
  error?: string;
};

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const result = await authenticateUser({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!result.ok) {
    return { error: result.error };
  }

  await setSessionCookie(result.user);
  redirect("/");
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const result = await registerUser({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  await setSessionCookie(result.user);
  redirect("/");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
