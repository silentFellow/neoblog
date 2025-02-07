import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

// users seciton
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("name", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
});
