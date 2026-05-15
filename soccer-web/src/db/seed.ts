import { db } from "./index";
import {
  users,
  groups,
  groupMembers,
  matches,
  matchJoins,
  matchComments,
} from "./schema";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = 10;
const PASSWORD = "pass123";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // ─── Create Users ───────────────────────────────────────────────────────────
    console.log("👥 Creating users...");

    const userEmails = [
      "steve@gmail.com",
      "peter@gmail.com",
      "dave@gmail.com",
      "john@gmail.com",
      "nick@gmail.com",
      ...Array.from({ length: 9 }, (_, i) => `user${i + 1}@gmail.com`),
    ];

    const createdUsers = await Promise.all(
      userEmails.map(async (email) => {
        const passwordHash = await hashPassword(PASSWORD);
        const [user] = await db
          .insert(users)
          .values({
            email,
            passwordHash,
            name: email.split("@")[0],
            photoUrl: null,
          })
          .returning();
        return user;
      })
    );

    const userMap = new Map(
      createdUsers.map((user) => [user.email, user.id])
    );

    console.log(`✓ Created ${createdUsers.length} users`);

    // ─── Create Groups ──────────────────────────────────────────────────────────
    console.log("👥 Creating groups...");

    const [sofiaDerby] = await db
      .insert(groups)
      .values({
        title: "Sofia Derby",
        description: "Weekly football matches in Sofia",
      })
      .returning();

    const [sundayHeroes] = await db
      .insert(groups)
      .values({
        title: "Sunday Heroes",
        description: "Sunday football matches for everyone",
      })
      .returning();

    console.log("✓ Created 2 groups");

    // ─── Add Group Members ──────────────────────────────────────────────────────

    console.log("📋 Adding group members...");

    // Sofia Derby members: steve, dave, nick, user1-user9
    const sofiaDerbyMembers = [
      "steve@gmail.com",
      "dave@gmail.com",
      "nick@gmail.com",
      ...Array.from({ length: 9 }, (_, i) => `user${i + 1}@gmail.com`),
    ];

    // Sunday Heroes members: steve, peter, john, user1-user9
    const sundayHeroesMembers = [
      "steve@gmail.com",
      "peter@gmail.com",
      "john@gmail.com",
      ...Array.from({ length: 9 }, (_, i) => `user${i + 1}@gmail.com`),
    ];

    // Add Sofia Derby members
    for (const email of sofiaDerbyMembers) {
      const userId = userMap.get(email)!;
      const isManager = email === "steve@gmail.com";
      await db.insert(groupMembers).values({
        groupId: sofiaDerby.id,
        userId,
        isManager,
      });
    }

    // Add Sunday Heroes members
    for (const email of sundayHeroesMembers) {
      const userId = userMap.get(email)!;
      const isManager = email === "steve@gmail.com" || email === "peter@gmail.com";
      await db.insert(groupMembers).values({
        groupId: sundayHeroes.id,
        userId,
        isManager,
      });
    }

    console.log(`✓ Added members to groups`);

    // ─── Create Matches ────────────────────────────────────────────────────────
    console.log("⚽ Creating matches...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchesData = [
      {
        groupId: sofiaDerby.id,
        date: addDays(today, 3),
        time: "18:00",
        location: "The School",
        capacity: 12,
      },
      {
        groupId: sofiaDerby.id,
        date: addDays(today, 5),
        time: "19:00",
        location: "Students Town",
        capacity: 12,
      },
      {
        groupId: sundayHeroes.id,
        date: addDays(today, 6),
        time: "10:00",
        location: "Arena 111",
        capacity: 10,
      },
      {
        groupId: sofiaDerby.id,
        date: addDays(today, -20),
        time: "18:00",
        location: "Students Town",
        capacity: 12,
      },
      {
        groupId: sundayHeroes.id,
        date: addDays(today, -30),
        time: "10:00",
        location: "Arena 111",
        capacity: 12,
      },
    ];

    const createdMatches = await Promise.all(
      matchesData.map(async (data) => {
        const [match] = await db.insert(matches).values(data).returning();
        return match;
      })
    );

    console.log(`✓ Created ${createdMatches.length} matches`);

    // ─── Create Match Joins ─────────────────────────────────────────────────────
    console.log("🤝 Creating match joins...");

    for (const match of createdMatches) {
      // Determine which group this match belongs to
      const isSOfiaDerby = match.groupId === sofiaDerby.id;
      const memberEmails = isSOfiaDerby
        ? sofiaDerbyMembers
        : sundayHeroesMembers;

      // Add half the members to each match
      const halfSize = Math.ceil(memberEmails.length / 2);
      const selectedMembers = memberEmails.slice(0, halfSize);

      for (const email of selectedMembers) {
        const userId = userMap.get(email)!;
        // Random extra slots (0-2)
        const extraSlots = Math.floor(Math.random() * 3);
        await db.insert(matchJoins).values({
          matchId: match.id,
          userId,
          extraSlots,
        });
      }
    }

    console.log(`✓ Created match joins`);

    // ─── Create Match Comments ──────────────────────────────────────────────────
    console.log("💬 Creating match comments...");

    const commentTemplates = [
      "Great match! Everyone played well.",
      "See you next time!",
      "Amazing performance today.",
      "Let's meet up earlier next time.",
      "Who's bringing the drinks?",
      "Best game we've had this season!",
      "Count me in for the next one.",
      "Thanks for organizing!",
      "Fantastic effort from everyone.",
      "Can't wait for the next match!",
    ];

    for (const match of createdMatches) {
      // Get members who joined this match
      const matchJoinRecords = await db.query.matchJoins.findMany({
        where: (mj, { eq }) => eq(mj.matchId, match.id),
      });

      // Add 2-4 comments per match
      const commentCount = Math.floor(Math.random() * 3) + 2;
      const selectedJoins = matchJoinRecords.slice(0, commentCount);

      for (const join of selectedJoins) {
        const randomComment =
          commentTemplates[
            Math.floor(Math.random() * commentTemplates.length)
          ];
        await db.insert(matchComments).values({
          matchId: match.id,
          userId: join.userId,
          text: randomComment,
        });
      }
    }

    console.log(`✓ Created match comments`);

    console.log("\n✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
