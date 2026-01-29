import { users } from "../db/schema/users";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../utils/hash";
import { db } from "src/db";
import { createAccessToken } from "./paseto";
import { userDevices } from "src/db/schema/userDevices";

type RegisterInput = {
  name: string;
  username: string;
  email?: string;
  phone?: string;
  password: string;
};

type LoginInput = {
  username: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
};

export const loginService = async (input: LoginInput) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, input.username))
    .limit(1);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await verifyPassword(input.password, user.password);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  // 🔐 access token (PASETO)
  const accessToken = await createAccessToken({
    sub: user.id,
    roleId: user.roleId,
  });

  // 🔁 refresh token (random, stateful)
  const refreshToken = crypto.randomUUID();

  await db.insert(userDevices).values({
    userId: user.id,
    refreshToken,
    userAgent: input.userAgent,
    ipAddress: input.ipAddress,
    expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 hari
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const registerService = async (input: RegisterInput) => {
  // 1️⃣ cek username sudah ada atau belum
  const existing = await db.query.users.findFirst({
    where: eq(users.username, input.username),
  });

  if (existing) {
    throw new Error("Username already exists");
  }

  // 2️⃣ hash password
  const hashedPassword = await hashPassword(input.password);

  // 3️⃣ insert user
  await db.insert(users).values({
    name: input.name,
    username: input.username,
    email: input.email,
    phone: input.phone,
    password: hashedPassword,
    roleId: 1,        // default role (misal: USER)
    isActive: true,   // nanti bisa false kalau pakai OTP
  });

  return {
    message: "Register success",
  };
};

//create new toke
export const refreshTokenService = async (refreshToken: string) => {
  const [device] = await db
    .select()
    .from(userDevices)
    .where(eq(userDevices.refreshToken, refreshToken))
    .limit(1);

  if (!device) {
    throw new Error("Invalid refresh token");
  }

  if (device.expiredAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, device.userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = await createAccessToken({
    sub: user.id,
    roleId: user.roleId,
  });

  return { accessToken };
};