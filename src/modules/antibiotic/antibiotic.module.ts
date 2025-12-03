import { Module } from '@nestjs/common';
import { AntibioticController } from './controller/antibiotic.controller';
import { AntibioticApiService } from './controller/antibiotic-api.service';
import { AntibiotiCreatorService } from './services/antibiotic-creator.service';
import { AntibioticGetterService } from './services/antibiotic-getter.service';

@Module({
  controllers: [AntibioticController],
  providers: [
    AntibioticGetterService,
    AntibiotiCreatorService,
    AntibioticApiService,
  ],
  exports: [AntibioticGetterService, AntibiotiCreatorService],
})
export class AntibioticModule {}
