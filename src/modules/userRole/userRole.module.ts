import { Module } from '@nestjs/common';
import { UserRoleService } from './services/userRole-updater.service';
import { UserRoleApiService } from './controllers/userRole-api.service';
import { UserRoleController } from './controllers/userRole.controller';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [UserRoleController],
  imports: [CommonModule],
  providers: [UserRoleApiService, UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
