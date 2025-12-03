import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
@Injectable()
export class AntibiotiCreatorService {
  constructor(private readonly _prisma: PrismaService) {}
  async create(data: ICreateAntibiotic) {
    const raw = await this._prisma.antibiotic.create({ data });
    return raw;
  }
}

export interface ICreateAntibiotic {
  name: string;
}
