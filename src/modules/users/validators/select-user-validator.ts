import { Prisma } from '@prisma/client';
// import { selectUserRoleValidator } from 'src/modules/userRole/validators/select-userRole.validator';

export const selectUserValidator = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    id: true,
    email: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    userRole: true,
  });
};
//
