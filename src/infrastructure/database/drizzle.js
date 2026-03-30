import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/config/env";

const client = postgres(env.databaseUrl);
const db = drizzle(client);

export { db };
export default db;
