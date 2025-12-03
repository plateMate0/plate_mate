import { PlateApiService } from './plate-api.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PlateDto } from '../dtos/plate.dto';
import { CreatePlateDto } from '../dtos/create-plate.dto';
import { GetUser } from 'src/common/decorators/req-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/services/jwt-auth.guard';
import { FindAllPlateDto } from '../dtos/find-all-plates.dto';
import { PaginationDto } from 'src/common/filter/pagination/pagination-param.dto';
import { PlateFilterDto } from '../dtos/filters-plates.dto';

@ApiTags('Plate')
@Controller('Plate')
export class PlateController {
  constructor(private readonly _plateApiService: PlateApiService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: PlateDto })
  @ApiOperation({ summary: 'Create a new plate' })
  async create(@GetUser() reqUser: number, @Body() data: CreatePlateDto) {
    return { result: await this._plateApiService.create(reqUser, data) };
  }

  // @Post('Process')
  // @ApiResponse({ type: ResultDto })
  // @ApiOperation({ summary: 'Start Processing' })
  // async process(@Param('id') id: number) {
  //   return await this._plateApiService.process(id);
  // }

  @Get(':id')
  @ApiResponse({ type: PlateDto })
  @ApiOperation({ summary: 'Get a Plate by ID' })
  async findOne(@Param('id') id: number) {
    return this._plateApiService.get(id);
  }

  @Get()
  @ApiResponse({ type: FindAllPlateDto })
  @ApiOperation({ summary: 'Get Plates by filters' })
  async findAll(
    @Query() filters: PlateFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    return this._plateApiService.getAll(filters, pagination);
  }

  @Get('result/:id')
  @ApiResponse({ type: PlateDto })
  @ApiOperation({ summary: 'Get a Plate by ID' })
  async findOneResult(@Param('id') id: number) {
    return this._plateApiService.getOneResult(id);
  }

  @Patch('result/:id/reject')
  @ApiResponse({ type: PlateDto })
  async rejectResult(@Param('id') id: number) {
    return this._plateApiService.rejectResult(id);
  }

  @Patch('result/:id/accept')
  @ApiResponse({ type: PlateDto })
  async acceptResult(@Param('id') id: number) {
    return this._plateApiService.acceptResult(id);
  }

  @Patch('result/:id/confuse')
  @ApiResponse({ type: PlateDto })
  async confuseResult(@Param('id') id: number) {
    return this._plateApiService.confuseResult(id);
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
