import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const roles = [{ name: 'admin' }, { name: 'user' }];

  Promise.all(
    roles.map(async (el) => {
      await prisma.role.upsert({
        where: { name: el.name },
        update: {},
        create: {
          name: el.name,
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
