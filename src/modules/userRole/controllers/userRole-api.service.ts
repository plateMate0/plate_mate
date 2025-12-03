import { Injectable } from '@nestjs/common';
import { UserRoleService } from '../services/userRole-updater.service';
import { UpdateRolePermissionsDto } from '../dtos/update-userRolePermission.dto';
import { RolePermissionDto } from '../dtos/role-permission.dto';

@Injectable()
export class UserRoleApiService {
  constructor(private readonly _userRoleService: UserRoleService) {}

  async update(
    id: number,
    data: UpdateRolePermissionsDto,
  ): Promise<RolePermissionDto[]> {
    const raws = await this._userRoleService.update(id, data);
    return raws.map((raw) => new RolePermissionDto(raw));
  }
}
