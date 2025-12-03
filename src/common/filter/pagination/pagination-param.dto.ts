import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: true, minimum: 0, default: 0 })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsDefined()
  skip: number;

  @ApiProperty({ required: true, minimum: 1, default: 10 })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsDefined()
  limit: number;
}
