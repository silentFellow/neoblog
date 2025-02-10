import { randomUUID } from "crypto";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// users seciton
export const users = pgTable("users", {
  id: text("id").primaryKey().default(randomUUID()),
  username: varchar("name", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  providerLogin: boolean("provider_login").notNull().default(false),
  profileImage: text("profile_image").notNull().default(""),
});

// blogs section
export const blogs = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tags: uuid("tags")
    .references(() => tags.id, { onDelete: "cascade" })
    .array(),
  author: text("author")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 99 }).notNull(),
  content: text("content").notNull(),
  thumbnail: text("thumbnail").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// tag section
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 30 }).notNull().unique(),
});
