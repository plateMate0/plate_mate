import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePlateDto {
  @ApiProperty()
  @IsString()
  patientFirstName: string;

  @ApiProperty()
  @IsString()
  patientLastName: string;

  @ApiProperty()
  @IsString()
  patientNumber: string;

  @ApiProperty()
  @IsNumber()
  mediaId: number;

  @ApiProperty()
  @IsString()
  notes: string;
}
