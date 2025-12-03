import { Prisma } from '@prisma/client';

export const selectPermissionValidator = () => {
  return Prisma.validator<Prisma.PermissionSelect>()({
    id: true,
    name: true,
  });
};
