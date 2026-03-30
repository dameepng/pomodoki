import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/database/schema.js",
  out: "./src/infrastructure/database/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
