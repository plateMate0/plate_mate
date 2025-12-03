import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';

@Injectable()
export class PatientDeleteService {
  constructor(private readonly _prisma: PrismaService) {}

  async delete(id: number) {
    return await this._prisma.patient.delete({ where: { id } });
  }
}
