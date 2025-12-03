import { Module } from '@nestjs/common';
import { PatientController } from './controllers/patient.controller';
import { PatientApiService } from './controllers/patient-api.service';
import { PatientGetterService } from './services/patient-getter.service';
import { PatientCreatorService } from './services/patient-creator.service';
import { PatientUpdaterService } from './services/patient-updater.service';
import { PatientDeleteService } from './services/patient-delete.service';

@Module({
  controllers: [PatientController],
  providers: [
    PatientApiService,
    PatientGetterService,
    PatientCreatorService,
    PatientUpdaterService,
    PatientDeleteService,
  ],
  exports: [
    PatientGetterService,
    PatientCreatorService,
    PatientUpdaterService,
    PatientDeleteService,
  ],
})
export class PatientModule {}
