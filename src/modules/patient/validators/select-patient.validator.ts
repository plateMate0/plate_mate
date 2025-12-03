import { Prisma } from '@prisma/client';

export const selectPatientValidator = () => {
  return Prisma.validator<Prisma.PatientSelect>()({
    id: true,
    firstName: true,
    lastName: true,
    number: true,
    createdAt: true,
    updatedAt: true,
  });
};
