import { Module } from '@nestjs/common';
import { HashPasswordService } from './services/hash-passowrd.service';
import { PipelineService } from './services/pipline.service';
import { PathsService } from './services/paths.service';
import { AntibioticLookupService } from './services/matching.service';

@Module({
  providers: [
    HashPasswordService,
    PipelineService,
    PathsService,
    AntibioticLookupService,
  ],
  exports: [
    HashPasswordService,
    PipelineService,
    PathsService,
    AntibioticLookupService,
  ],
})
export class CommonModule {}
