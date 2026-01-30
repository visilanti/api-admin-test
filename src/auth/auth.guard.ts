import { verifyAccessToken } from "./paseto";

export const authGuard = async ({ request, set, store }: any) => {
  const auth = request.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    set.status = 401;
    throw new Error("Unauthorized");
  }

  const token = auth.slice(7);

  const payload = await verifyAccessToken(token);

  // simpan ke store (context shared)
  store.user = {
    id: payload.sub,
    roleId: payload.roleId,
  };
};
