CREATE TABLE IF NOT EXISTS "group_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"is_manager" boolean DEFAULT false NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "match_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "match_joins" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"extra_slots" integer DEFAULT 0 NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"time" varchar(5) NOT NULL,
	"location" varchar(255) NOT NULL,
	"capacity" integer NOT NULL,
	"canceled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"photo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_group_members_group" ON "group_members" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_group_members_user" ON "group_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_group_members_unique" ON "group_members" USING btree ("group_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_match_comments_match" ON "match_comments" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_match_comments_user" ON "match_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_match_joins_match" ON "match_joins" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_match_joins_user" ON "match_joins" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_match_joins_unique" ON "match_joins" USING btree ("match_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_matches_group" ON "matches" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_matches_date" ON "matches" USING btree ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" USING btree ("email");