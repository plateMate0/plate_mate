import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { PrismaTx } from 'src/modules/prisma/services/prisma-tx.type';
import { MediaGetterService } from 'src/modules/media/services/media-getter.service';
import { PipelineService } from 'src/modules/common/services/pipline.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { selectFullPlateValidator } from '../validators/full-plate.validator';
import { RawPlate } from '../dtos/plate.dto';
import { PathsService } from 'src/modules/common/services/paths.service';
import { AntibioticLookupService } from 'src/modules/common/services/matching.service';
@Injectable()
export class PlateCreatorService {
  constructor(
    private readonly _prisma: PrismaService,
    private _mediaService: MediaGetterService,
    private _pipelineService: PipelineService,
    private _pathsService: PathsService,
    private _matching: AntibioticLookupService,
  ) {}

  async create(prisma: PrismaTx, data: ICreatePlate): Promise<RawPlate> {
    // console.log(11);

    const plate = await prisma.plate.create({
      data: {
        notes: data.notes,
        patient: { connect: { id: data.patientId } },
        image: { connect: { id: data.mediaId } },
        user: { connect: { id: data.userId } }, // required relation
      },
      select: selectFullPlateValidator(),
      // data,
    });
    // console.log(1);

    const result = await prisma.result.create({
      data: { status: 'Undetected', plateId: plate.id },
      // select: selectResultValidator(),
    });
    // console.log(1);

    const tmp = await this.kickoffPipeline(
      prisma,
      plate.id,
      plate.image.path,
      result.id,
    ).catch(() => {
      /* تجاهل الأخطاء هنا */
    });
    console.log(tmp);

    return await prisma.plate.findUniqueOrThrow({
      where: { id: plate.id },
      select: selectFullPlateValidator(),
    });
  }

  private async kickoffPipeline(
    prisma: PrismaTx,
    plateId: number,
    mediaPath: string,
    resultId: number,
  ) {
    const segOutBase = process.env.SEG_OUT_BASE;
    //    console.log(2);

    if (!segOutBase) return;
    // console.log(33);

    const plate = await prisma.plate.findUnique({
      where: { id: plateId },
      select: selectFullPlateValidator(),
    });
    // console.log('p', plate);

    if (!plate) return;

    // outDir خاص بالـ plate (لا نخزّنه في DB)
    const outDir = path.resolve(segOutBase, `plate_${plateId}`);
    const uploads = path.resolve('D:/WORK/uploads'); // يثبت المجلد

    const excelPath = path.resolve(
      uploads,
      `D:/WORK/uploads/final_results_plate_${plateId}.xlsx`,
    );
    console.log('EEXXXX', excelPath);

    // مسارات ملفات القياس
    const measureOutDir = path.resolve(outDir, 'measure_out');

    const jsonPath = path.resolve(
      uploads,
      `D:/WORK/uploads/final_results_plate_${plateId}.json`,
    );
    await fs.mkdir(outDir, { recursive: true });
    await fs.mkdir(measureOutDir, { recursive: true });
    // console.log('info', outDir, excelPath, jsonPath);
    // const mediaPath = (await this._mediaService.get(mediaId)).path;
    // outDir خاص بالـ plate (لا نخزّنه في DB)
    // const outDir = path.resolve(segOutBase, `plate_${plateId}`);
    // const excelPath = path.resolve(outDir, 'final_results.xlsx');
    await fs.mkdir(outDir, { recursive: true });

    try {
      await this._pipelineService.runPythonPipeline({
        imagePath: mediaPath,
        outDir,
        excelPath,
      });
      // نجاح: خزّن excelPath فقط
      await prisma.plate.update({
        where: { id: plateId },
        data: { excel_path: `final_results_plate_${plateId}.xlsx` },
      });

      const items = await this._pathsService.readPerImageJson(jsonPath);
      console.log('DDDAATTA', items);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const name = String(item.antibiotic_name ?? item.name ?? '').trim();
        if (!name) continue;

        const value = Number(item.zone_diam_mm);
        if (!Number.isFinite(value)) continue;

        let anti = await prisma.antibiotic.findFirst({
          where: { name },
        });
        console.log('1:', item);
        if (!anti || anti.name != name) {
          anti = await prisma.antibiotic.create({
            data: { name },
          });
        }
        console.log('2:', anti);
        const { low, high } = this._matching.getBreakpoints(name); // أو 'AK'
        let aa = '';
        if (value < low) aa = 'S';
        else if (value < high) aa = 'I';
        else aa = 'R';
        const anti_det = await prisma.antibioticDetection.create({
          data: {
            antibioticId: anti.id,
            value,
            resultId,
            sir: aa,
          },
        });
        console.log('item : ', anti_det);
      }
      // items.map(async (item) => {});
    } catch {
      // فشل: لا نحدّث شيئًا (excelPath يبقى null)
    }
  }

  // async process(id: number): Promise<RawResult> {
  //   // const plate = await this._prisma.plate.findUniqueOrThrow({ where: { id } });
  //   const raw = await this._prisma.result.create({
  //     data: { status: 'Done', plateId: id ,},
  //     select: selectResultValidator(),
  //     // select: {
  //     //   antibioticDetections: {},
  //     //   status: true,
  //     //   plateId: true,
  //     // },
  //   });
  //   return new ResultDto(raw);
  // }
}
export interface ICreatePlate {
  userId: number;
  patientId: number;
  mediaId: number;
  notes: string;
}
