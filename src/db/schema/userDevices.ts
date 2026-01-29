import {
  mysqlTable,
  int,
  varchar,
  datetime,
  text,
} from "drizzle-orm/mysql-core";
import { users } from "./users";
import { sql } from "drizzle-orm";

export const userDevices = mysqlTable("user_devices", {
  id: int("id").primaryKey().autoincrement(),

  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  userAgent: varchar("user_agent", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 25 }),
  location: varchar("location", { length: 255 }),

  refreshToken: text("refresh_token").notNull(),

  expiredAt: datetime("expired_at").notNull(),

  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),

});