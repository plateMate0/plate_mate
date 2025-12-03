import { Prisma } from '@prisma/client';

export const selectMediaValidator = () => {
  return Prisma.validator<Prisma.MediaSelect>()({
    id: true,
    path: true,
    name: true,
    createdAt: true,
    updatedAt: true,
  });
};
