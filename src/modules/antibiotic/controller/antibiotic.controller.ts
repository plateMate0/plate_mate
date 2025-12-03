import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AntibioticApiService } from './antibiotic-api.service';
import { AntiBioticDto } from '../dtos/antibiotic.dto';
import { CreateAntiBioticDto } from '../dtos/createAntibiotic.dto';

@ApiTags('Antibiotic')
@Controller('antibiotic')
export class AntibioticController {
  constructor(private readonly _antibioticApiService: AntibioticApiService) {}

  @Post()
  @ApiResponse({ type: AntiBioticDto })
  @ApiOperation({ summary: 'Create a new plate' })
  async create(@Body() data: CreateAntiBioticDto) {
    return await this._antibioticApiService.create(data);
  }

  @Get(':id')
  @ApiResponse({ type: AntiBioticDto })
  @ApiOperation({ summary: 'Create a new plate' })
  async get(@Param('id') id: number) {
    return await this._antibioticApiService.get(id);
  }
}
