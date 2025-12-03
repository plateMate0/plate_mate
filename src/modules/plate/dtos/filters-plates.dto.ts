import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { SearchDto } from 'src/common/filter/search.dto';

export class PlateFilterDto extends SearchDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}
