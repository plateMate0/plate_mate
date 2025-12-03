import { Prisma } from '@prisma/client';

export const selectUserRoleValidator = () => {
  return Prisma.validator<Prisma.UserRoleSelect>()({
    id: true,
    name: true,
  });
};
