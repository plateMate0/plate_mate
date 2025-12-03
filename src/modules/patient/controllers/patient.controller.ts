import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/filter/pagination/pagination-param.dto';
// import { UserDto } from 'src/modules/plate/dtos/user.dto';
// import { UpdateUserDto } from 'src/modules/users/dtos/update-user.dto';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { PatientApiService } from './patient-api.service';

@ApiTags('Patient')
@Controller('patient')
export class PatientController {
  constructor(private readonly _patientApiService: PatientApiService) {}

  @Post()
  @ApiResponse({ type: CreatePatientDto })
  @ApiOperation({ summary: 'Create a new patient' })
  async create(@Body() data: CreatePatientDto) {
    return await this._patientApiService.create(data);
  }

  // @Get()
  // @ApiResponse({ type: FindAllUserDto })
  // @ApiOperation({ summary: 'Get all users' })
  // async findAll(
  //   @Query() pagination: PaginationDto,
  //   @Query() filter?: UserFilterDto,
  // ) {
  //   return this._userApiService.getAll(pagination, filter);
  // }

  @Get(':id')
  @ApiResponse({ type: PaginationDto })
  @ApiOperation({ summary: 'Get a patient by ID' })
  async findOne(@Param('id') id: number) {
    return this._patientApiService.get(id);
  }

  // @Patch(':id')
  // @ApiResponse({ type: UserDto })
  // @ApiOperation({ summary: 'Update a user by ID' })
  // async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
  //   return this._userApiService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a user by ID' })
  // async remove(@Param('id') id: number) {
  //   return this._userApiService.delete(id);
  // }
}
