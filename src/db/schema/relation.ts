import { relations } from "drizzle-orm";
import { users } from "./users";
import { roles } from "./roles";
import { userDevices } from "./userDevices";

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  devices: many(userDevices),
}));

export const userDevicesRelations = relations(userDevices, ({ one }) => ({
  user: one(users, {
    fields: [userDevices.userId],
    references: [users.id],
  }),
}));