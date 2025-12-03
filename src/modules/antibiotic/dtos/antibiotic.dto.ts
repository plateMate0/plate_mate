import { ApiProperty } from '@nestjs/swagger';

export class AntiBioticDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  // @ApiProperty()
  // createdAt: Date;

  // @ApiProperty()
  // updatedAt: Date;

  constructor(raw: RawAntiBiotic) {
    this.id = raw.id;
    this.name = raw.name;
    // this.createdAt = raw.createdAt;
    // this.updatedAt = raw.updatedAt;
  }
}

export class AntiBioticDetectionDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  sir?: string;

  @ApiProperty()
  antibiotic: AntiBioticDto;

  @ApiProperty()
  value: number;

  // @ApiProperty()
  // createdAt: Date;

  // @ApiProperty()
  // updatedAt: Date;

  constructor(raw: RawAntiBioticDetection) {
    this.id = raw.id;
    this.antibiotic = new AntiBioticDto(raw.antibiotic);
    this.value = raw.value;
    this.sir = raw.sir ?? null;
    // this.createdAt = raw.createdAt;
    // this.updatedAt = raw.updatedAt;
  }
}

export type RawAntiBioticDetection = Omit<
  AntiBioticDetectionDto,
  'createdAt' | 'updatedAt' | 'deletedAt' | 'plateId'
> & {};
export type RawAntiBiotic = Omit<
  AntiBioticDto,
  'createdAt' | 'updatedAt' | 'deletedAt' | 'plateId'
> & {};
