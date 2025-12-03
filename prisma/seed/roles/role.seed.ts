import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import ROLES from './roles.json';

export async function upsertRoles(prisma: PrismaService) {
  await prisma.$transaction(
    ROLES.map((role) =>
      prisma.userRole.upsert({
        where: { id: role.id },
        create: { id: role.id, name: role.name },
        update: {},
      }),
    ),
  );
}
