import { Elysia, t } from "elysia";
import { loginService, refreshTokenService, registerService } from "./auth.service";

export const authRoute = new Elysia({ prefix: "/auth" })
  // POST /auth/login
  .post(
    "/login",
    async ({ body, request }) => {
      return loginService({
        username: body.username,
        password: body.password,
        userAgent: request.headers.get("user-agent") ?? undefined,
        ipAddress: request.headers.get("x-forwarded-for") ?? "local",
      });
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  )
  
  // POST /auth/register
  .post(
    "/register",
    async ({ body }) => {
      return registerService(body);
    },
    {
      body: t.Object({
        name: t.String(),
        username: t.String(),
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        password: t.String({ minLength: 6 }),
      }),
    }
  )
  
  .post(
  "/token",
  ({ body }) => refreshTokenService(body.refreshToken),
  {
    body: t.Object({
      refreshToken: t.String(),
    }),
  }
);