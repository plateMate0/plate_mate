import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@prisma/client';

export class PermissionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
  constructor(raw: RawPermission) {
    this.id = raw.id;
    this.name = raw.name;
  }
}

export type RawPermission = Omit<
  Permission,
  'deletedAt' | 'createdAt' | 'updatedAt'
> & {};
