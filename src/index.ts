import { Elysia } from "elysia";
import { authRoute } from "./auth/auth.route";

new Elysia()
  .use(authRoute)
  .listen(3000);

console.log("Server running on http://localhost:3000");