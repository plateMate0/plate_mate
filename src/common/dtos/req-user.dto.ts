import { ApiProperty } from '@nestjs/swagger';

export class ReqUserDto {
  @ApiProperty()
  id: number;
}
