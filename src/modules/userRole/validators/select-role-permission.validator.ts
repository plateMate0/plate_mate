import { Prisma } from '@prisma/client';
import { selectPermissionValidator } from './select-permissionValidator';

export const selectRolePermissionValidator = () => {
  return Prisma.validator<Prisma.RolePermissionSelect>()({
    id: true,
    permission: { select: selectPermissionValidator() },
  });
};
