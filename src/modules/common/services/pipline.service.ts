// pipeline/pipeline.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fs_ from 'fs';

// const envBool = (v?: string) => (v ?? '').toLowerCase() === 'true';

@Injectable()
export class PipelineService {
  async ensureExists(filePath: string) {
    try {
      await fs.access(filePath);
    } catch {
      throw new InternalServerErrorException(
        `Image not found on disk: ${filePath}`,
      );
    }
  }

  // async runPythonPipeline(opts: {
  //   imagePath: string;
  //   outDir: string; // سنولّد الـ excel داخل هذا المجلد
  //   excelPath: string;
  // }): Promise<{ stdout: string; stderr: string }> {
  //   const PYTHON_EXE = process.env.PYTHON_EXE || 'python';
  //   const PIPELINE_DIR = process.env.PIPELINE_DIR;
  //   const PIPELINE_SCRIPT = process.env.PIPELINE_SCRIPT;
  //   if (!PIPELINE_DIR || !PIPELINE_SCRIPT) {
  //     throw new InternalServerErrorException(
  //       'PIPELINE_DIR or PIPELINE_SCRIPT is not set in env.',
  //     );
  //   }

  //   console.log('^^');
  //   const scriptPath = path.resolve(PIPELINE_DIR, PIPELINE_SCRIPT);
  //   const yoloWeights = process.env.YOLO_WEIGHTS ?? '';
  //   const segWeights = process.env.SEG_WEIGHTS ?? '';
  //   const truthCsv = process.env.SEG_TRUTH_CSV; // اختياري

  //   const diskMM = Number(process.env.SEG_DISK_MM ?? 6.0);
  //   const conf = Number(process.env.SEG_CONF ?? 0.45);
  //   const iou = Number(process.env.SEG_IOU ?? 0.5);
  //   const roi = Number(process.env.SEG_ROI ?? 6.0);
  //   const imgsz = Number(process.env.SEG_IMGSZ ?? 384);

  //   const noCrop = envBool(process.env.SEG_NO_CROP_OVERLAYS);
  //   const noMeasure = envBool(process.env.SEG_NO_MEASURE_OVERLAYS);

  //   const args: string[] = [
  //     scriptPath,
  //     '--image',
  //     path.resolve(opts.imagePath),
  //     '--out',
  //     path.resolve(opts.outDir),
  //     '--yolo_weights',
  //     path.resolve(yoloWeights),
  //     '--seg_weights',
  //     path.resolve(segWeights),
  //     '--excel_path',
  //     path.resolve(opts.excelPath),
  //     '--disk_mm',
  //     String(diskMM),
  //     '--conf',
  //     String(conf),
  //     '--iou',
  //     String(iou),
  //     '--roi',
  //     String(roi),
  //     '--imgsz_seg',
  //     String(imgsz),
  //   ];

  //   if (truthCsv) args.push('--truth_csv', path.resolve(truthCsv));
  //   if (noCrop) args.push('--no_crop_overlays');
  //   if (noMeasure) args.push('--no_measure_overlays');

  //   console.log(100);
  //   return await new Promise(async (resolve, reject) => {
  //     const child = await spawn(PYTHON_EXE, args, {
  //       shell: false,
  //       windowsHide: true,
  //     });
  //     let stdout = '';
  //     let stderr = '';
  //     console.log('**');
  //     child.stdout.on('data', (d) => (stdout += d.toString()));
  //     child.stderr.on('data', (d) => (stderr += d.toString()));
  //     child.on('error', reject);
  //     console.log('**', stdout, stderr);
  //     child.on('close', (code) => {
  //       if (code === 0) resolve({ stdout, stderr });
  //       else
  //         reject(
  //           new InternalServerErrorException(
  //             `Python exited with code ${code}\n${stderr}`,
  //           ),
  //         );
  //     });
  //   });
  // }

  async withImageExtension(srcPath: string, fallbackExt = '.jpg') {
    const hasExt = path.extname(srcPath);
    if (hasExt) return srcPath;
    const dstPath = path.join(
      path.dirname(srcPath),
      `${path.basename(srcPath)}${fallbackExt}`,
    );
    fs_.copyFileSync(srcPath, dstPath);
    return dstPath;
  }

  async runPythonPipeline(opts: {
    imagePath: string;
    outDir: string;
    excelPath: string;
  }): Promise<{ stdout: string; stderr: string }> {
    const PYTHON_EXE = process.env.PYTHON_EXE || 'python';
    const PIPELINE_DIR = process.env.PIPELINE_DIR!;
    const PIPELINE_SCRIPT = process.env.PIPELINE_SCRIPT!;

    if (!PIPELINE_DIR || !PIPELINE_SCRIPT) {
      throw new InternalServerErrorException(
        'PIPELINE_DIR or PIPELINE_SCRIPT is not set in env.',
      );
    }
    const scriptPath = path.resolve(PIPELINE_DIR, PIPELINE_SCRIPT);
    const yoloWeights = process.env.YOLO_WEIGHTS!;
    const segWeights = process.env.SEG_WEIGHTS!;
    // const truthCsv = process.env.SEG_TRUTH_CSV;

    const diskMM = Number(process.env.SEG_DISK_MM ?? 6.0);
    const conf = Number(process.env.SEG_CONF ?? 0.45);
    const iou = Number(process.env.SEG_IOU ?? 0.5);
    const roi = Number(process.env.SEG_ROI ?? 6.0);
    const imgsz = Number(process.env.SEG_IMGSZ ?? 384);

    // const noCrop =
    //   (process.env.SEG_NO_CROP_OVERLAYS ?? '').toLowerCase() === 'true';
    // const noMeasure =
    //   (process.env.SEG_NO_MEASURE_OVERLAYS ?? '').toLowerCase() === 'true';

    // --- [ADDED] أدوات مساعدة صغيرة ---
    const fsP = (p: string) =>
      fs
        .access(p)
        .then(() => true)
        .catch(() => false);

    // يحلّ أي قيمة بالصورة لمسار مطلق صالح:
    const resolveImagePath = async (p: string): Promise<string> => {
      if (path.isAbsolute(p) && (await fsP(p))) return p;

      // 1) جرّب MEDIA_BASE_DIR لو موجود
      const baseEnv = process.env.MEDIA_BASE_DIR;
      if (baseEnv) {
        const c1 = path.resolve(baseEnv, p);
        if (await fsP(c1)) return c1;
        // إن كان p عبارة عن hash بدون امتداد، دوّر على ملف يبدأ فيه
        try {
          const files = await fs.readdir(baseEnv);
          const hit = files.find((f) => f.startsWith(p));
          if (hit) {
            const full = path.resolve(baseEnv, hit);
            if (await fsP(full)) return full;
          }
        } catch {}
      }

      // 2) افتراض: uploads جنب project2 (..\\uploads)
      const c2 = path.resolve(process.cwd(), '..', 'uploads', p);
      if (await fsP(c2)) return c2;

      throw new InternalServerErrorException(
        `Image not found. Tried:
- ${path.isAbsolute(p) ? p : '(relative) ' + p}
- ${baseEnv ? path.resolve(baseEnv, p) : '(no MEDIA_BASE_DIR)'}
- ${c2}`,
      );
    };

    // --- [ADDED] حل مسار الصورة قبل الفحوصات ---
    const resolvedImagePath = await this.withImageExtension(
      await resolveImagePath(opts.imagePath),
    );

    console.log('[imagePath]', resolvedImagePath);

    // ✅ فحوصات وجود الملفات قبل التنفيذ
    const checks = await Promise.all([
      fsP(PYTHON_EXE),
      fsP(scriptPath),
      fsP(resolvedImagePath),
      fsP(yoloWeights),
      fsP(segWeights),
    ]);
    const names = [
      'PYTHON_EXE',
      'PIPELINE_SCRIPT',
      'image',
      'YOLO_WEIGHTS',
      'SEG_WEIGHTS',
    ];
    checks.forEach((ok, i) => {
      if (!ok) throw new InternalServerErrorException(`${names[i]} not found`);
    });

    const args: string[] = [
      '-u', // منع تبفيف stdout/stderr
      scriptPath,
      '--image',
      path.resolve(resolvedImagePath),
      '--out',
      path.resolve(opts.outDir),
      '--yolo_weights',
      path.resolve(yoloWeights),
      '--seg_weights',
      path.resolve(segWeights),
      '--excel_path',
      path.resolve(opts.excelPath),
      '--disk_mm',
      String(diskMM),
      '--conf',
      String(conf),
      '--iou',
      String(iou),
      '--roi',
      String(roi),
      '--imgsz_seg',
      String(imgsz),
    ];
    // if (truthCsv) args.push('--truth_csv', path.resolve(truthCsv));
    // if (noCrop) args.push('--no_crop_overlays');
    // if (noMeasure) args.push('--no_measure_overlays');

    console.log('RUN:', PYTHON_EXE, args.join(' '), ' CWD=', PIPELINE_DIR);

    return new Promise((resolve, reject) => {
      const child = spawn(PYTHON_EXE, args, {
        cwd: PIPELINE_DIR,
        shell: false,
        windowsHide: true,
        env: { ...process.env, PYTHONUNBUFFERED: '1' },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      child.on('spawn', () => console.log('spawned PID=', child.pid));
      child.stdout.on('data', (d) => {
        stdout += d.toString();
      });
      child.stderr.on('data', (d) => {
        stderr += d.toString();
      });

      child.on('error', (err) => reject(err));
      child.on('close', (code) => {
        console.log('closed with code', code);
        if (code === 0) resolve({ stdout, stderr });
        else
          reject(
            new InternalServerErrorException(
              `Python exited with code ${code}\n${stderr}`,
            ),
          );
      });
    });
  }
}
