import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto, RawPermission } from './permission.dto';
import { RolePermission } from '@prisma/client';

export class RolePermissionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  permission: PermissionDto;

  constructor(raw: RawUserRolePermission) {
    this.id = raw.id;
    this.permission = new PermissionDto(raw.permission);
  }
}

export type RawUserRolePermission = Omit<
  RolePermission,
  'permissionId' | 'userRoleId' | 'deletedAt' | 'createdAt' | 'updatedAt'
> & {
  permission: RawPermission;
};
