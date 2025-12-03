import { Type } from '@nestjs/common';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export function createPaginationDto<T>(itemType: Type<T>) {
  @ApiExtraModels(itemType)
  class PaginationDto {
    @ApiProperty()
    count: number;

    @ApiProperty({
      isArray: true,
      type: () => itemType,
    })
    data: T[];
  }

  return PaginationDto;
}
