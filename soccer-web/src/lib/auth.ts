import { cookies } from "next/headers";
import { cache } from "react";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { SESSION_COOKIE_NAME } from "./auth-constants";

export { SESSION_COOKIE_NAME };

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  photoUrl: string | null;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: AuthUser) {
  return new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    algorithms: ["HS256"],
  });
  const userId = Number(payload.sub);

  if (!Number.isInteger(userId) || userId < 1) {
    return null;
  }

  return {
    id: userId,
    email: String(payload.email ?? ""),
    name: String(payload.name ?? ""),
  };
}

export async function setSessionCookie(user: AuthUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await verifySessionToken(token);

    if (!session) {
      return null;
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        photoUrl: users.photoUrl,
      })
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1);

    return user ?? null;
  } catch {
    return null;
  }
});
