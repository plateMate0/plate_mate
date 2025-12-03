import { Injectable } from '@nestjs/common';
import { CreatePlateDto } from '../dtos/create-plate.dto';
import { PlateDto } from '../dtos/plate.dto';
import { PlateCreatorService } from '../services/plate-creator.service';
import { PlateGetterService } from '../services/plate-getter.service';
import { ResultDto } from '../dtos/result.dto';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { PatientCreatorService } from 'src/modules/patient/services/patient-creator.service';
import { PlateUpdatorService } from '../services/plate-updater.service';
import { FindAllPlateDto } from '../dtos/find-all-plates.dto';
import { PlateFilterDto } from '../dtos/filters-plates.dto';
import { PaginationDto } from 'src/common/filter/pagination/pagination-param.dto';

@Injectable()
export class PlateApiService {
  constructor(
    private readonly _plateCreator: PlateCreatorService,
    private readonly _plateGetter: PlateGetterService,
    private readonly _patientCreator: PatientCreatorService,
    private readonly _plateUpdater: PlateUpdatorService,

    // private readonly _plateUpdater: PlateUpdaterService,
    // private readonly _plateDelete: PlateDeleteService,
    private readonly _prisma: PrismaService,
  ) {}

  async create(userId: number, data: CreatePlateDto): Promise<PlateDto> {
    // console.log(userId, data);
    const raw = await this._prisma.$transaction(
      async (prisma) => {
        const patient = await this._patientCreator.create(prisma, {
          firstName: data.patientFirstName,
          lastName: data.patientLastName,
          number: data.patientNumber,
        });
        const result = await this._plateCreator.create(prisma, {
          patientId: patient.id,
          userId: userId,
          mediaId: data.mediaId,
          notes: data.notes,
        });

        return result;
      },
      { maxWait: 20_0000, timeout: 120_0000 }, // إن اضطررت
    );
    // const raw = await this._plateCreator.create(data);
    return new PlateDto(raw);
  }

  // async process(id: number): Promise<ResultDto> {
  //   const raw = await this._plateCreator.process(id);
  //   return new ResultDto(raw);
  // }

  async get(plateId: number): Promise<PlateDto> {
    const raw = await this._plateGetter.findById(plateId);
    return new PlateDto(raw);
  }

  async getAll(
    filters: PlateFilterDto,
    pagination: PaginationDto,
  ): Promise<FindAllPlateDto> {
    const raw = await this._plateGetter.findAll(pagination, filters);
    return raw;
  }

  async getOneResult(resultId: number): Promise<ResultDto> {
    const raw = await this._plateGetter.findResultById(resultId);
    return new ResultDto(raw);
  }

  async rejectResult(resultId: number): Promise<ResultDto> {
    const raw = await this._plateUpdater.update(resultId, 'rejected');
    return new ResultDto(raw);
  }

  async acceptResult(resultId: number): Promise<ResultDto> {
    const raw = await this._plateUpdater.update(resultId, 'accepted');
    return new ResultDto(raw);
  }

  async confuseResult(resultId: number): Promise<ResultDto> {
    const raw = await this._plateUpdater.update(resultId, 'confused');
    return new ResultDto(raw);
  }
  // async delete(data: CreatePlateDto): Promise<PlateDto> {
  //   const raw = await this._plateCreator.create(data);
  //   return new PlateDto(raw);
  // }
}
