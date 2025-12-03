import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  constructor() {
    super();
    this.$use(async (params, next) => {
      try {
        return await next(params);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            console.log(error);

            throw new ConflictException(
              `Unique constraint violated on ${error?.meta?.modelName}.`,
            );
          } else if (error.code === 'P2025') {
            throw new NotFoundException(
              `Record not found in ${error?.meta?.modelName}.`,
            );
          } else if (error.code === 'P2017')
            throw new NotFoundException('Relation record not found.');
          else if (error.code === 'P2003') {
            throw new ConflictException(
              `Foreign key constraint failed on ${error.meta.field_name}.`,
            );
          }
        }
        throw error;
      }
    });

    const models = Object.keys(Prisma.ModelName).reduce((pre, curr) => {
      return { ...pre, [curr]: true };
    }, {});

    this.$use(
      createSoftDeleteMiddleware({
        defaultConfig: {
          field: 'deletedAt',
          createValue: (deleted) => {
            if (deleted) return new Date();
            return null;
          },
          allowToOneUpdates: true,
        },
        models,
      }),
    );
  }
}
