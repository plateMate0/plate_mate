import { Controller, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserRoleApiService } from './userRole-api.service';
import { UpdateRolePermissionsDto } from '../dtos/update-userRolePermission.dto';
import { RolePermissionDto } from '../dtos/role-permission.dto';

@ApiTags('User Role')
@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleApiService: UserRoleApiService) {}

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ type: [RolePermissionDto] })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRolePermissionsDto,
  ): Promise<RolePermissionDto[]> {
    return this.userRoleApiService.update(id, data);
  }
}
