import { Injectable } from '@nestjs/common';
import { MediaCreatorService } from '../services/media-creator.service';
import { MediaDto } from '../dtos/media.dto';
import { MediaGetterService } from '../services/media-getter.service';

@Injectable()
export class MediaApiService {
  constructor(
    private readonly _mediaCreator: MediaCreatorService,
    private readonly _mediaGetter: MediaGetterService,
  ) {}

  async upload(file: Express.Multer.File) {
    const raw = await this._mediaCreator.upload({
      name: file.originalname,
      path: file.filename,
    });
    return new MediaDto(raw);
  }

  async get(mediaId: number) {
    const raw = await this._mediaGetter.get(mediaId);
    return new MediaDto(raw);
  }
}
