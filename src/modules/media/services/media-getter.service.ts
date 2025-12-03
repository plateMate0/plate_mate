import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { selectMediaValidator } from '../validators/select-media.validator';
import { RawMedia } from '../dtos/media.dto';

@Injectable()
export class MediaGetterService {
  constructor(private readonly _prisma: PrismaService) {}
  async get(mediaId: number): Promise<RawMedia> {
    return await this._prisma.media.findUniqueOrThrow({
      where: {
        id: mediaId,
      },
      select: selectMediaValidator(),
    });
  }
}
