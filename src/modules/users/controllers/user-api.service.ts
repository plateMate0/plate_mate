import { UserCreatorService } from '../services/user-creator.service';
import { UserGetterService } from '../services/user-getter.service';
import { UserUpdaterService } from '../services/user-updater.service';
import { UserDeleteService } from '../services/user-delete.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PaginationDto } from 'src/common/filter/pagination/pagination-param.dto';
import { UserFilterDto } from '../dtos/user-filter.dto';
import { UserDto } from '../dtos/user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { FindAllUserDto } from '../dtos/find-all-user.dto';

@Injectable()
export class UserApiService {
  constructor(
    private readonly _userCreator: UserCreatorService,
    private readonly _userGetter: UserGetterService,
    private readonly _userUpdater: UserUpdaterService,
    private readonly _userDelete: UserDeleteService,
  ) {}

  async create(data: CreateUserDto): Promise<UserDto> {
    const raw = await this._userCreator.create(data);
    return new UserDto(raw);
  }

  async findOne(id: number): Promise<UserDto> {
    const raw = await this._userGetter.findById(id);
    return new UserDto(raw);
  }

  async findAll(
    pagination: PaginationDto,
    filter: UserFilterDto,
  ): Promise<FindAllUserDto> {
    return await this._userGetter.findAll(pagination, filter);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserDto> {
    const raw = await this._userUpdater.update(id, data);
    return new UserDto(raw);
  }

  async delete(id: number): Promise<{ message: string }> {
    await this._userDelete.delete(id);
    return { message: 'Successfully deleted' };
  }
}
