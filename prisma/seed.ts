import "dotenv/config";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "dev@fitore.local" },
    update: {},
    create: { email: "dev@fitore.local", name: "Dev Athlete" },
  });

  const gym =
    (await prisma.gym.findFirst({ where: { name: "Dev Gym" } })) ??
    (await prisma.gym.create({ data: { name: "Dev Gym" } }));

  await prisma.membership.upsert({
    where: { userId_gymId: { userId: user.id, gymId: gym.id } },
    update: { role: Role.ATHLETE },
    create: { userId: user.id, gymId: gym.id, role: Role.ATHLETE },
  });

  console.log("Seeded:", { userId: user.id, gymId: gym.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
