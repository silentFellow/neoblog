import { randomUUID } from "crypto";
import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";

// users seciton
export const users = pgTable("users", {
  id: text("id").primaryKey().default(randomUUID()),
  username: varchar("name", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  providerLogin: boolean("provider_login").default(false),
});
