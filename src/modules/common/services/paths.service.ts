import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { parse as parseCsv } from 'csv-parse/sync'; // npm i csv-parse

@Injectable()
export class PathsService {
  constructor() {}

  async buildPlateOutPaths(baseOut: string, plateId: number) {
    const slug = `plate_${plateId}`;
    const outDir = path.join(baseOut, slug);
    const measureOutDir = path.join(outDir, 'measure_out');

    const excelPath = path.join(outDir, 'final_results.xlsx');
    const csvPerImage = path.join(measureOutDir, 'per_image.csv');
    const csvRaw = path.join(measureOutDir, 'zone_measure_raw.csv');
    const jsonPath = path.join(measureOutDir, 'per_image.json');

    fs.mkdirSync(measureOutDir, { recursive: true });
    return { slug, outDir, excelPath, csvPerImage, csvRaw, jsonPath };
  }

  // اختياري: لو بدك تمسح محتوى المجلد قبل كل تشغيل (حتى ما تختلط نتائج قديمة)
  async ensureEmptyDir(dir: string) {
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        fs.rmSync(path.join(dir, f), { recursive: true, force: true });
      }
    } else {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async csvToJsonFile(csvPath: string, jsonPath: string) {
    const csv = fs.readFileSync(csvPath, 'utf8');
    const records = parseCsv(csv, { columns: true, skip_empty_lines: true });
    fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf8');
    return records;
  }

  async readPerImageJson(jsonPath: string) {
    const filePath = jsonPath; // Adjust the path as needed
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    // Now 'jsonObject' is your JavaScript object
    // console.log(jsonObject);
    if (!Array.isArray(data))
      throw new Error('per_image.json must be an array');
    return data as any[];
  }
}
