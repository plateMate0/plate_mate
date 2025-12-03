import { ApiProperty } from '@nestjs/swagger';
import { Media } from '@prisma/client';

export class MediaDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  constructor(raw: RawMedia) {
    this.id = raw.id;
    this.name = raw.name;
    this.path = raw.path;
  }
}

export type RawMedia = Omit<Media, 'deletedAt'> & {};
