import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { PaginationDto } from 'src/common/filter/pagination/pagination-param.dto';
import { UserFilterDto } from '../dtos/user-filter.dto';
import { FindAllUserDto } from '../dtos/find-all-user.dto';
import { selectUserValidator } from '../validators/select-user-validator';
// import { RawUser } from '../dtos/user.dto';

@Injectable()
export class UserGetterService {
  constructor(private readonly _prisma: PrismaService) {}

  async findAll(
    pagination: PaginationDto,
    filter?: UserFilterDto,
  ): Promise<FindAllUserDto> {
    const skip = Math.max(0, pagination.skip || 0);
    const take = pagination.limit || 10;
    const { search } = filter ?? {};

    const where = search
      ? {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
        }
      : {};

    const [data, count] = await Promise.all([
      this._prisma.user.findMany({
        where,
        skip,
        take,
        select: selectUserValidator(),
      }),
      this._prisma.user.count({ where }),
    ]);

    return new FindAllUserDto(count, data);
  }

  async findById(id: number) {
    return await this._prisma.user.findUniqueOrThrow({
      where: { id },
      select: { ...selectUserValidator(), password: true },
    });
  }

  async findByEmail(email: string) {
    return await this._prisma.user.findUnique({
      where: { email },
      select: { ...selectUserValidator(), password: true },
    });
  }
}
