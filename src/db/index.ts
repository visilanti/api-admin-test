import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

import * as schema from "./schema"; // 🔥 INI PENTING

export const pool = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  database: process.env.DB_NAME as string,
  port: Number(process.env.DB_PORT ?? 3306),
});

export const db = drizzle(pool, {
  schema, // 🔥 TANPA INI → ERROR KAMU
  mode: "default",
});