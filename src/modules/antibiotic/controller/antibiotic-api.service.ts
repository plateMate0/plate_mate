import { Injectable } from '@nestjs/common';
import { AntibiotiCreatorService } from '../services/antibiotic-creator.service';
import { AntibioticGetterService } from '../services/antibiotic-getter.service';
import { AntiBioticDto } from '../dtos/antibiotic.dto';
import { CreateAntiBioticDto } from '../dtos/createAntibiotic.dto';

@Injectable()
export class AntibioticApiService {
  constructor(
    private readonly _antibioticCreator: AntibiotiCreatorService,
    private readonly _antibioticGetter: AntibioticGetterService,
  ) {}
  async create(data: CreateAntiBioticDto) {
    const raw = await this._antibioticCreator.create(data);
    return new AntiBioticDto(raw);
  }
  async get(id: number) {
    const raw = await this._antibioticGetter.get(id);
    return new AntiBioticDto(raw);
  }
}
