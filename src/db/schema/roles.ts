import {
  mysqlTable,
  int,
  varchar,
  boolean,
  datetime,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const roles = mysqlTable("roles", {
  id: int("id").primaryKey().autoincrement(),

  name: varchar("name", { length: 35 }).notNull(),
  isActive: boolean("is_active").default(true),

  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`),

  createdBy: int("created_by"),

  modifiedAt: datetime("modified_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),

  modifiedBy: int("modified_by"),
});