import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAntiBioticDto {
  @ApiProperty()
  @IsString()
  name: string;
}
