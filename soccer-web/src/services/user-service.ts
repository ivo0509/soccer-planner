import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import type { AuthUser } from "@/lib/auth";

const PASSWORD_SALT_ROUNDS = 12;

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);

  if (name.length < 2) {
    return { ok: false, error: "Please enter your full name." };
  }

  if (!email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (input.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  const [createdUser] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      photoUrl: users.photoUrl,
    });

  return { ok: true, user: createdUser };
}

export async function authenticateUser(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = normalizeEmail(input.email);

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      photoUrl: users.photoUrl,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return { ok: false, error: "Invalid email or password." };
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    return { ok: false, error: "Invalid email or password." };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    },
  };
}
