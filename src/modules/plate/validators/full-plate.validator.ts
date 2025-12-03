import { Prisma } from '@prisma/client';
import { selectResultValidator } from './select-result.validator';
import { selectPatientValidator } from 'src/modules/patient/validators/select-patient.validator';
import { selectMediaValidator } from 'src/modules/media/validators/select-media.validator';

export const selectFullPlateValidator = () => {
  return Prisma.validator<Prisma.PlateSelect>()({
    patient: { select: selectPatientValidator() },
    result: { select: selectResultValidator() },
    id: true,
    excel_path: true,
    image: { select: selectMediaValidator() },
    notes: true,
    createdAt: true,
    updatedAt: true,
  });
};
