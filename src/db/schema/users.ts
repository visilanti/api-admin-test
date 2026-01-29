import {
  mysqlTable,
  int,
  varchar,
  boolean,
  datetime,
} from "drizzle-orm/mysql-core";
import { roles } from "./roles";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),

  name: varchar("name", { length: 50 }).notNull(),
  username: varchar("username", { length: 35 }).notNull(),
  email: varchar("email", { length: 125 }),
  phone: varchar("phone", { length: 25 }),

  password: varchar("password", { length: 255 }).notNull(),

  roleId: int("role_id")
    .notNull()
    .references(() => roles.id),

  isActive: boolean("is_active").default(false),

  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: int("created_by"),

  modifiedAt: datetime("modified_at").default(sql`CURRENT_TIMESTAMP`),
  modifiedBy: int("modified_by"),
});