import { Prisma } from '@prisma/client';
import { selectAntibioticValidator } from './select-antibiotic.validator';

export const selectAntibioticDetectionValidator = () => {
  return Prisma.validator<Prisma.AntibioticDetectionSelect>()({
    id: true,
    antibiotic: { select: selectAntibioticValidator() },
    value: true,
    sir: true,
  });
};
