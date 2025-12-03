import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { UpdateRolePermissionsDto } from '../dtos/update-userRolePermission.dto';
import { selectRolePermissionValidator } from '../validators/select-role-permission.validator';
import { RawUserRolePermission } from '../dtos/role-permission.dto';

@Injectable()
export class UserRoleService {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: number,
    data: UpdateRolePermissionsDto,
  ): Promise<RawUserRolePermission[]> {
    const { permissionIds } = data;

    const currentUserRole = await this.prisma.rolePermission.findMany({
      where: { userRoleId: id },
      select: { permissionId: true, id: true, deletedAt: true },
    });

    const currentPermissionIds = currentUserRole.map(
      (userRolePermission) => userRolePermission.permissionId,
    );

    const permissionsToAddOrRestore = permissionIds.filter((permissionId) => {
      const currentPermission = currentUserRole.find(
        (rolePermission) => rolePermission.permissionId === permissionId,
      );
      return !currentPermission || currentPermission.deletedAt;
    });

    const permissionsToRemove = currentPermissionIds.filter(
      (permissionId) => !permissionIds.includes(permissionId),
    );

    if (permissionsToAddOrRestore.length > 0) {
      await this.prisma.rolePermission.updateMany({
        where: {
          userRoleId: id,
          permissionId: { in: permissionsToAddOrRestore },
          deletedAt: { not: null },
        },
        data: { deletedAt: null },
      });

      const newPermissions = permissionsToAddOrRestore.filter((permId) => {
        return !currentPermissionIds.includes(permId);
      });

      if (newPermissions.length > 0) {
        await this.prisma.rolePermission.createMany({
          data: newPermissions.map((permId) => ({
            permissionId: permId,
            userRoleId: id,
          })),
          skipDuplicates: true,
        });
      }
    }

    if (permissionsToRemove.length > 0) {
      await this.prisma.rolePermission.updateMany({
        where: {
          userRoleId: id,
          permissionId: { in: permissionsToRemove },
        },
        data: { deletedAt: new Date() },
      });
    }

    const updatedUserRole = await this.prisma.rolePermission.findMany({
      where: { userRoleId: id },
      select: selectRolePermissionValidator(),
    });

    return updatedUserRole;
  }
}

export interface IUpdateUserRole {
  name: string;
  permissions: IUpdatepermission[];
}

export interface IUpdatepermission {
  name: string;
}
