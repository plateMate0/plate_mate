import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserRoleDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  constructor(raw: RawUserRole) {
    this.id = raw.id;
    this.name = raw.name;
  }
}

export type RawUserRole = Omit<UserRole, 'createdSt' | 'updatedAt'> & {};
