import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export { sql, db };
