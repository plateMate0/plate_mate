import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { ICreatePatient } from './patient-creator.service';

@Injectable()
export class PatientUpdaterService {
  constructor(private readonly _prisma: PrismaService) {}
}
export type IUpdatePatient = Partial<ICreatePatient>;
