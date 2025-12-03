import { PaginationListDto } from 'src/common/response/pagination-list.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PlateDto, RawPlate } from './plate.dto';

export class FindAllPlateDto extends PaginationListDto<PlateDto> {
  @ApiProperty({ type: [PlateDto] })
  data: PlateDto[];

  constructor(count: number, raws: RawPlate[]) {
    const plates = raws.map((raw) => new PlateDto(raw));
    super(count, plates);
    this.data = plates;
  }
}
