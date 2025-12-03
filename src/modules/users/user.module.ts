import { Module } from '@nestjs/common';
import { UserGetterService } from './services/user-getter.service';
import { UserCreatorService } from './services/user-creator.service';
import { UserUpdaterService } from './services/user-updater.service';
import { UserDeleteService } from './services/user-delete.service';
import { UserApiService } from './controllers/user-api.service';
import { UserController } from './controllers/user.controller';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [UserController],
  imports: [CommonModule],
  providers: [
    UserApiService,
    UserGetterService,
    UserCreatorService,
    UserUpdaterService,
    UserDeleteService,
  ],
  exports: [
    UserGetterService,
    UserCreatorService,
    UserUpdaterService,
    UserDeleteService,
  ],
})
export class UserModule {}
