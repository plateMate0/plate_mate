import { ApiProperty } from '@nestjs/swagger';
import { Result } from '@prisma/client';
import {
  AntiBioticDetectionDto,
  RawAntiBioticDetection,
} from 'src/modules/antibiotic/dtos/antibiotic.dto';

export class ResultDto {
  @ApiProperty()
  id: number;

  // @ApiProperty()
  // plateId: number;

  @ApiProperty()
  status: string;

  // @ApiProperty({ required: false })
  // sir?: string;

  @ApiProperty({ type: () => [AntiBioticDetectionDto] })
  antibioticDetections: AntiBioticDetectionDto[] = [];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(raw?: RawResult | null) {
    if (!raw) return; // <- important: handle null Result
    this.id = raw.id;
    // this.sir = raw.sir;
    this.status = raw.status;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
    this.antibioticDetections =
      raw.antibioticDetections?.map((a) => new AntiBioticDetectionDto(a)) ?? [];
  }
}

export type RawResult = Omit<Result, 'deletedAt' | 'plateId'> & {
  antibioticDetections?: RawAntiBioticDetection[];
};
