import { ApiProperty } from '@nestjs/swagger';
import { Plate } from '@prisma/client';
import { RawResult, ResultDto } from './result.dto';
import { MediaDto, RawMedia } from 'src/modules/media/dtos/media.dto';
import { PatientDto, RawPatient } from 'src/modules/patient/dtos/patient.dto';
import { IsOptional } from 'class-validator';

export class PlateDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: PatientDto })
  patient: PatientDto;

  // @ApiProperty({ type: UserDto })
  // user: UserDto;

  @ApiProperty({ type: MediaDto })
  image: MediaDto;

  @ApiProperty()
  notes: string;

  @ApiProperty({ required: false })
  @IsOptional()
  excel_path?: string;

  @ApiProperty({ type: ResultDto })
  result: ResultDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(raw: RawPlate) {
    this.id = raw.id;
    this.result = new ResultDto(raw.result);
    this.patient = new PatientDto(raw.patient);
    this.notes = raw.notes;
    this.image = new MediaDto(raw.image);
    this.excel_path = raw.excel_path ?? null;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
  }
}

export type RawPlate = Omit<
  Plate,
  'deletedAt' | 'mediaId' | 'userId' | 'resultId' | 'patientId'
> & {
  patient: RawPatient;
  result: RawResult;
  image: RawMedia;
};

// export class FullPlateDto {
//   @ApiProperty()
//   id: number;

//   @ApiProperty({ type: PatientDto })
//   patient: PatientDto;

//   // @ApiProperty({ type: UserDto })
//   // user: UserDto;

//   @ApiProperty({ type: MediaDto })
//   media: MediaDto;

//   @ApiProperty()
//   notes: string;

//   @ApiProperty({ type: ResultDto })
//   result: ResultDto;

//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   updatedAt: Date;

//   constructor(raw: RawFullPlate) {
//     this.id = raw.id;
//     this.result = new ResultDto(raw.result);
//     this.patient = new PatientDto(raw.patient);
//     this.notes = raw.notes;
//     this.media = new MediaDto(raw.media);
//     this.createdAt = raw.createdAt;
//     this.updatedAt = raw.updatedAt;
//   }
// }

// export type RawFullPlate = Omit<
//   Plate,
//   'deletedAt' | 'mediaId' | 'userId' | 'resultId' | 'patientId'
// > & {
//   patient: RawPatient;
//   result: RawResult;
//   media: RawMedia;
// };
