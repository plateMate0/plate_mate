import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { ICreateUser } from './user-creator.service';
import { UserDto } from '../dtos/user.dto';
import { selectUserValidator } from '../validators/select-user-validator';

@Injectable()
export class UserUpdaterService {
  constructor(private readonly _prisma: PrismaService) {}
  async update(id: number, data: IUpdateUser): Promise<UserDto> {
    return await this._prisma.user.update({
      where: { id },
      data,
      select: selectUserValidator(),
    });
  }
}

export type IUpdateUser = Partial<ICreateUser>;
