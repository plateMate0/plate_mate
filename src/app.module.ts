import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { CommonModule } from './modules/common/common.module';
import { PatientModule } from './modules/patient/patient.module';
import { MediaModule } from './modules/media/media.module';
import { PlateModule } from './modules/plate/plate.module';
import { AntibioticModule } from './modules/antibiotic/antibiotic.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    CommonModule,
    PatientModule,
    MediaModule,
    PlateModule,
    AntibioticModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
