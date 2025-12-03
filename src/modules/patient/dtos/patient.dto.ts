import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '@prisma/client';

export class PatientDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(raw: RawPatient) {
    this.id = raw.id;
    this.firstName = raw.firstName;
    this.lastName = raw.lastName;
    this.number = raw.number;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
  }
}

export type RawPatient = Omit<Patient, 'deletedAt'> & {};
