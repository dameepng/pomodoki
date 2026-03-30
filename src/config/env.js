const env = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  nodeEnv: process.env.NODE_ENV || "development",
};

if (env.nodeEnv === "production") {
  if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is required when NODE_ENV is production.");
  }

  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is required when NODE_ENV is production.");
  }
}

export { env };
export default env;
