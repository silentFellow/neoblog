import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { config } from "dotenv";
config({ path: "../../.env.local" });

const val: string | undefined = process.env.DATABASE_URL;
if (val === undefined)
  throw new Error("DATABASE_URL environment variable is not set");
const migrationClient = postgres(val, { max: 1 });

const main = async (): Promise<void> => {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./migrations",
  });

  await migrationClient.end();
};

main();
