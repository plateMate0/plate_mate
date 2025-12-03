import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { RawPatient } from '../dtos/patient.dto';

@Injectable()
export class PatientGetterService {
  constructor(private readonly _prisma: PrismaService) {}

  async findById(id: number): Promise<RawPatient> {
    return await this._prisma.patient.findUniqueOrThrow({
      where: { id },
    });
  }
}
