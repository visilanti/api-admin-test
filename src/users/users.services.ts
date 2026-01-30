import { db } from "../db";
import { users } from "../db/schema/users";
import { roles } from "../db/schema/roles";
import { and, eq, like, sql } from "drizzle-orm";

type UserQuery = {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  role?: number;
  limit?: number;
  page?: number;
  sort?: string;
};

export const listUsersService = async (q: UserQuery) => {
  const limit = q.limit ?? 10;
  const page = q.page ?? 1;
  const offset = (page - 1) * limit;

  const where: any[] = [];

  if (q.name) where.push(like(users.name, `%${q.name}%`));
  if (q.username) where.push(like(users.username, `%${q.username}%`));
  if (q.email) where.push(like(users.email, `%${q.email}%`));
  if (q.phone) where.push(like(users.phone, `%${q.phone}%`));
  if (q.active !== undefined) where.push(eq(users.isActive, q.active));
  if (q.role) where.push(eq(users.roleId, q.role));

  const orderBy =
    q.sort === "username"
      ? users.username
      : q.sort === "name"
        ? users.name
        : users.createdAt;

  const data = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      phone: users.phone,
      isActive: users.isActive,
      createdAt: users.createdAt,
      role: {
        id: roles.id,
        name: roles.name,
      },
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .where(where.length ? and(...where) : undefined)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(users)
    .where(where.length ? and(...where) : undefined);

  return {
    data,
    meta: {
      page,
      limit,
      total,
    },
  };
};
