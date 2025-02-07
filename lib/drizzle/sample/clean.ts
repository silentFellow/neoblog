import { sql } from "drizzle-orm";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { config } from "dotenv";
config({ path: "../../../.env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const db = drizzle(pool);

const main = async () => {
  try {
    console.log("Cleanup of db started...");
    await pool.connect();

    // TDOO: Execute DELETE operations sequentially
    // for blogs and tags
    await db.execute(sql`DELETE FROM users`);

    // TDOO: Execute DELETE operations sequentially
    // for blogs and tags
    await db.execute(sql`DROP TABLE users`);

    console.log("Successfully cleaned up");
  } catch (error: any) {
    console.log(`Error cleaning data: ${error.message}`);
  } finally {
    process.exit(0);
  }
};

main();
