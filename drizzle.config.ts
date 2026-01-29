import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/**/*.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    database: process.env.DB_NAME as string,
    port: Number(process.env.DB_PORT ?? 3306),
  },
} satisfies Config;