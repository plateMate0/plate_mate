import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { RawPlate } from '../dtos/plate.dto';
import { RawResult } from '../dtos/result.dto';
import { PaginationDto } from 'src/common/filter/pagination/pagination-param.dto';
import { PlateFilterDto } from '../dtos/filters-plates.dto';
import { Prisma } from '@prisma/client';
import { FindAllPlateDto } from '../dtos/find-all-plates.dto';
import { selectResultValidator } from '../validators/select-result.validator';
import { selectFullPlateValidator } from '../validators/full-plate.validator';
// import { equal } from 'assert';
// import { equals } from 'class-validator';

@Injectable()
export class PlateGetterService {
  constructor(private readonly _prisma: PrismaService) {}

  async findById(id: number): Promise<RawPlate> {
    return await this._prisma.plate.findUniqueOrThrow({
      where: { id },
      select: selectFullPlateValidator(),
    });
  }

  async findResultById(id: number): Promise<RawResult> {
    return await this._prisma.result.findUniqueOrThrow({
      where: { id },
      select: selectResultValidator(),
    });
  }

  safeStr = (v?: string) => v?.trim() || undefined;
  safeDate = (v?: string) => {
    if (!v) return undefined;
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d;
  };

  async findAll(pagination: PaginationDto, filter: PlateFilterDto) {
    const search = this.safeStr(filter?.search);
    const firstName = this.safeStr((filter as any)?.firstName);
    const lastName = this.safeStr((filter as any)?.lastName);
    const start = this.safeDate(filter?.startDate);
    const end = this.safeDate(filter?.endDate);
    const andFilters: Prisma.PlateWhereInput[] = [];

    if (firstName || lastName) {
      andFilters.push({
        patient: {
          ...(firstName ? { firstName: { contains: firstName } } : {}),
          ...(lastName ? { lastName: { contains: lastName } } : {}),
        },
      });
    }

    if (filter?.userId) {
      andFilters.push({ userId: filter.userId });
    }

    if (filter?.status) {
      andFilters.push({ result: { is: { status: filter.status } } });
    }

    if (start || end) {
      andFilters.push({
        createdAt: {
          ...(start ? { gte: start } : {}),
          ...(end ? { lte: end } : {}),
        },
      });
    }

    // OR bucket: global free-text search across multiple fields/relations
    const orFilters: Prisma.PlateWhereInput[] = [];

    if (search) {
      orFilters.push(
        { notes: { contains: search } },
        // {
        //   patient: {
        //     OR: [
        //       { firstName: { contains: search } },
        //       { lastName: { contains: search } },
        //       { number: { contains: search } },
        //     ],
        //   },
        // },

        {
          user: {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
            ],
          },
        },
        {
          image: {
            OR: [
              { name: { contains: search } },
              { path: { contains: search } },
            ],
          },
        },
      );
    }

    const where: Prisma.PlateWhereInput = {
      ...(andFilters.length ? { AND: andFilters } : {}),
      ...(orFilters.length ? { OR: orFilters } : {}),
    };
    const [raws, count] = await Promise.all([
      this._prisma.plate.findMany({
        where,
        select: selectFullPlateValidator(),
        skip: pagination?.skip ?? 0,
        take: pagination?.limit ?? 10,
        orderBy: { createdAt: 'desc' },
      }),
      this._prisma.plate.count({ where }),
    ]);

    return new FindAllPlateDto(count, raws);
  }
}
