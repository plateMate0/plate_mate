import { PrismaService } from './../../src/modules/prisma/services/prisma.service';
import { upsertRoles } from './roles/role.seed';

const prisma = new PrismaService();

async function main() {
  console.log('Seeding...');

  await upsertRoles(prisma);

  console.log('Done Seeding.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
