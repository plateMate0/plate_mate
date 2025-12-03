import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserApiService } from './user-api.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PaginationDto } from 'src/common/filter/pagination/pagination-param.dto';
import { UserDto } from '../dtos/user.dto';
import { UserFilterDto } from '../dtos/user-filter.dto';
import { FindAllUserDto } from '../dtos/find-all-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly _userApiService: UserApiService) {}

  @Post()
  @ApiResponse({ type: CreateUserDto })
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() data: CreateUserDto) {
    return this._userApiService.create(data);
  }

  @Get()
  @ApiResponse({ type: FindAllUserDto })
  @ApiOperation({ summary: 'Get all users' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query() filter?: UserFilterDto,
  ) {
    return this._userApiService.findAll(pagination, filter);
  }

  @Get(':id')
  @ApiResponse({ type: UserDto })
  @ApiOperation({ summary: 'Get a user by ID' })
  async findOne(@Param('id') id: number) {
    return this._userApiService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ type: UserDto })
  @ApiOperation({ summary: 'Update a user by ID' })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this._userApiService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  async delete(@Param('id') id: number) {
    return this._userApiService.delete(id);
  }
}
