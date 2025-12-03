import { Injectable } from '@nestjs/common';
import { PrismaTx } from 'src/modules/prisma/services/prisma-tx.type';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
@Injectable()
export class PatientCreatorService {
  constructor(private readonly _prisma: PrismaService) {}

  async create(prisma: PrismaTx, data: ICreatePatient) {
    const patient =
      (await prisma.patient.findFirst({
        where: { firstName: data.firstName, lastName: data.lastName },
      })) ||
      (await prisma.patient.create({
        data,
      }));
    return patient;
  }
}
export interface ICreatePatient {
  firstName: string;
  lastName: string;
  number: string;
}
