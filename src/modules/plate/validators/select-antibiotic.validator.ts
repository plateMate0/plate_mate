import { Prisma } from '@prisma/client';

export const selectAntibioticValidator = () => {
  return Prisma.validator<Prisma.AntibioticSelect>()({
    id: true,
    name: true,
  });
};
