import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { selectMediaValidator } from '../validators/select-media.validator';

@Injectable()
export class MediaCreatorService {
  constructor(private readonly _prisma: PrismaService) {}
  async upload(data: ICreateMedia) {
    return await this._prisma.media.create({
      data,
      select: selectMediaValidator(),
    });
  }
}

interface ICreateMedia {
  path: string;
  name: string;
}
