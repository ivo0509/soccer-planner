import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    photoUrl: text("photo_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("idx_users_email").on(t.email)]
);

// ─── Groups ───────────────────────────────────────────────────────────────────

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Group Members ────────────────────────────────────────────────────────────

export const groupMembers = pgTable(
  "group_members",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id").notNull(),
    userId: integer("user_id").notNull(),
    isManager: boolean("is_manager").default(false).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_group_members_group").on(t.groupId),
    index("idx_group_members_user").on(t.userId),
    index("idx_group_members_unique").on(t.groupId, t.userId),
  ]
);

// ─── Matches ──────────────────────────────────────────────────────────────────

export const matches = pgTable(
  "matches",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id").notNull(),
    date: timestamp("date").notNull(),
    time: varchar("time", { length: 5 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    capacity: integer("capacity").notNull(),
    canceled: boolean("canceled").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_matches_group").on(t.groupId),
    index("idx_matches_date").on(t.date),
  ]
);

// ─── Match Joins ──────────────────────────────────────────────────────────────

export const matchJoins = pgTable(
  "match_joins",
  {
    id: serial("id").primaryKey(),
    matchId: integer("match_id").notNull(),
    userId: integer("user_id").notNull(),
    extraSlots: integer("extra_slots").default(0).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_match_joins_match").on(t.matchId),
    index("idx_match_joins_user").on(t.userId),
    index("idx_match_joins_unique").on(t.matchId, t.userId),
  ]
);

// ─── Match Comments ───────────────────────────────────────────────────────────

export const matchComments = pgTable(
  "match_comments",
  {
    id: serial("id").primaryKey(),
    matchId: integer("match_id").notNull(),
    userId: integer("user_id").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_match_comments_match").on(t.matchId),
    index("idx_match_comments_user").on(t.userId),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  groupMembers: many(groupMembers),
  matchJoins: many(matchJoins),
  matchComments: many(matchComments),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(groupMembers),
  matches: many(matches),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, { fields: [groupMembers.groupId], references: [groups.id] }),
  user: one(users, { fields: [groupMembers.userId], references: [users.id] }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  group: one(groups, { fields: [matches.groupId], references: [groups.id] }),
  joins: many(matchJoins),
  comments: many(matchComments),
}));

export const matchJoinsRelations = relations(matchJoins, ({ one }) => ({
  match: one(matches, { fields: [matchJoins.matchId], references: [matches.id] }),
  user: one(users, { fields: [matchJoins.userId], references: [users.id] }),
}));

export const matchCommentsRelations = relations(matchComments, ({ one }) => ({
  match: one(matches, { fields: [matchComments.matchId], references: [matches.id] }),
  user: one(users, { fields: [matchComments.userId], references: [users.id] }),
}));
