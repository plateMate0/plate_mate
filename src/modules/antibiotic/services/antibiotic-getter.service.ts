import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { RawAntiBiotic } from '../dtos/antibiotic.dto';
@Injectable()
export class AntibioticGetterService {
  constructor(private readonly _prisma: PrismaService) {}

  async get(id: number): Promise<RawAntiBiotic> {
    const raw = await this._prisma.antibiotic.findUniqueOrThrow({
      where: { id: id },
    });
    return raw;
  }
}
