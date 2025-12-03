import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { RawResult } from '../dtos/result.dto';
@Injectable()
export class PlateUpdatorService {
  constructor(private readonly _prisma: PrismaService) {}

  async update(resultId: number, status: string): Promise<RawResult> {
    const result = await this._prisma.result.update({
      where: { id: resultId },
      data: {
        status,
      },
    });
    // console.log(result);
    return result;
  }
}
