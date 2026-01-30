import { Elysia, t } from "elysia";
import { listUsersService } from "./users.services";
import { authGuard } from "../auth/auth.guard";

export const usersRoute = new Elysia({ prefix: "/users" }).get(
  "/",
  async ({ query }) => {
    return listUsersService(query);
  },
  {
    beforeHandle: authGuard,
    query: t.Object({
      name: t.Optional(t.String()),
      username: t.Optional(t.String()),
      email: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      active: t.Optional(t.Boolean()),
      role: t.Optional(t.Numeric()),
      limit: t.Optional(t.Numeric()),
      page: t.Optional(t.Numeric()),
      sort: t.Optional(t.String()),
    }),
  },
);
