import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  constructor(raw: RawUser) {
    this.id = raw.id;
    this.name = raw.name;
    this.email = raw.email;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
  }
}

export type RawUser = Omit<UserDto, 'password'> & {};
