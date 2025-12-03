import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    type: [Number],
    description: 'permissions of the role',
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  permissionIds?: number[];
}
