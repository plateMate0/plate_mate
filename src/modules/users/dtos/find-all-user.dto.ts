import { PaginationListDto } from 'src/common/response/pagination-list.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto, RawUser } from './user.dto';

export class FindAllUserDto extends PaginationListDto<UserDto> {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];

  constructor(count: number, raws: RawUser[]) {
    const user = raws.map((raw) => new UserDto(raw));
    super(count, user);
    this.data = user;
  }
}
