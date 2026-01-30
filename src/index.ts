import { Elysia } from "elysia";
import { authRoute } from "./auth/auth.route";
import { usersRoute } from "./users/users.route";

new Elysia()
  .use(authRoute)
  .use(usersRoute)
  .listen(3000);

console.log("Server running on http://localhost:3000");