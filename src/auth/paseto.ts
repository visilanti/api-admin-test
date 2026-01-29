import { encrypt, decrypt } from "paseto-ts/v4";

const secretHex = process.env.PASETO_SECRET;
if (!secretHex) {
  throw new Error("Missing PASETO_SECRET in .env");
}

const rawKey = Buffer.from(secretHex, "hex");
if (rawKey.length !== 32) {
  throw new Error("PASETO_SECRET must be 32 bytes (64 hex chars)");
}

/**
 * 🔑 PASETO v4.local KEY
 * wajib prefix: "k4.local."
 */
const PASETO_KEY = Buffer.concat([
  Buffer.from("k4.local.", "utf8"),
  rawKey,
]);

export type AccessTokenPayload = {
  sub: number;
  roleId: number;
};


/**
 * CREATE TOKEN
 */
export const ACCESS_TOKEN_TTL_MINUTES = 15;

export const getAccessTokenExpiry = () =>
  new Date(Date.now() + ACCESS_TOKEN_TTL_MINUTES * 60 * 1000);

export const createAccessToken = async (
  payload: AccessTokenPayload
): Promise<string> => {
  return encrypt(PASETO_KEY, {
    sub: String(payload.sub),
    roleId: payload.roleId,
    iat: new Date().toISOString(),
    exp: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  });
};

/**
 * VERIFY TOKEN
 */
export const verifyAccessToken = async (
  token: string
): Promise<AccessTokenPayload> => {
  const { payload } = await decrypt(PASETO_KEY, token);

  if (!payload.sub || !payload.roleId) {
    throw new Error("Invalid token payload");
  }

  return {
    sub: Number(payload.sub),
    roleId: payload.roleId as number,
  };
};
