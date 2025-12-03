import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './controllers/media.controller';
import { MediaCreatorService } from './services/media-creator.service';
import { MediaApiService } from './controllers/media-api.service';
import { MediaGetterService } from './services/media-getter.service';

@Module({
  controllers: [MediaController],
  providers: [MediaApiService, MediaCreatorService, MediaGetterService],
  exports: [MediaCreatorService, MediaGetterService],
  imports: [
    MulterModule.register({
      dest: '../uploads',
    }),
  ],
})
export class MediaModule {}
