import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from '../dtos/upload-file.dto';
import { MediaApiService } from './media-api.service';
import { MediaDto } from '../dtos/media.dto';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly _mediaApiService: MediaApiService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('media'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @ApiResponse({ type: MediaDto })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          //      new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<MediaDto> {
    return await this._mediaApiService.upload(file);
  }

  @Get(':id')
  @ApiResponse({ type: MediaDto })
  async get(@Param('id') id: number) {
    return await this._mediaApiService.get(id);
  }
}
