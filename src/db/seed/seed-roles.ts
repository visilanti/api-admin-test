import "dotenv/config";
import { db } from "../index";
import { roles } from "../schema/roles";
import { eq } from "drizzle-orm";

const seedRoles = async () => {
  const existing = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "USER"))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(roles).values([
      { id: 1, name: "USER", isActive: true },
      { id: 2, name: "ADMIN", isActive: true },
    ]);

    console.log("✅ Roles seeded");
  } else {
    console.log("ℹ️ Roles already exist, skip seeding");
  }

  process.exit(0);
};

seedRoles().catch((err) => {
  console.error("❌ Seed roles failed:", err);
  process.exit(1);
});