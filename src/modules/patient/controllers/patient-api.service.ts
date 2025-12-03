import { Injectable } from '@nestjs/common';
import { PatientCreatorService } from '../services/patient-creator.service';
import { PatientGetterService } from '../services/patient-getter.service';
import { PatientUpdaterService } from '../services/patient-updater.service';
import { PatientDeleteService } from '../services/patient-delete.service';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { PatientDto } from '../dtos/patient.dto';

@Injectable()
export class PatientApiService {
  constructor(
    private readonly _patientCreator: PatientCreatorService,
    private readonly _patientGetter: PatientGetterService,
    private readonly _patientUpdater: PatientUpdaterService,
    private readonly _patientDelete: PatientDeleteService,
  ) {}

  async create(data: CreatePatientDto) {
    // const raw = await this._patientCreator.create(data);
    // return new PatientDto(raw);
  }
  async get(patientId: number): Promise<PatientDto> {
    const raw = await this._patientGetter.findById(patientId);
    return new PatientDto(raw);
  }
  // async delete(data: CreatePatientDto): Promise<PatientDto> {
  //   const raw = await this._patientCreator.create(data);
  //   return new PatientDto(raw);
  // }
}
