import { Prisma } from '@prisma/client';
import { selectAntibioticDetectionValidator } from './select-antibioticDetection.validator';

export const selectResultValidator = () => {
  return Prisma.validator<Prisma.ResultSelect>()({
    id: true,
    antibioticDetections: { select: selectAntibioticDetectionValidator() },
    status: true,
    // sir: true,
    createdAt: true,
    updatedAt: true,
  });
};
