// src/modules/antibiotic/services/antibiotic-lookup.service.ts
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

type Breakpoints = { low: number; high: number };

@Injectable()
export class AntibioticLookupService implements OnModuleInit {
  private readonly byKey = new Map<string, Breakpoints>();

  // عدّل المسار حسب مكان الملف عندك
  private readonly csvPath = join(
    process.cwd(),
    'assets',
    'ISR - bacterial sensetivity_to_antibiotics.csv',
  );

  onModuleInit() {
    const csv = readFileSync(this.csvPath, 'utf8');
    const rows: any[] = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      trim: true,
    });

    for (const r of rows) {
      const code = (r['Antibiotec'] ?? '').toString().trim().toLowerCase();
      const name = (r['Antibiotec.1'] ?? '').toString().trim().toLowerCase();

      const low = Number(r['R ( Below )']);
      const high = Number(r['S ( Above )']);

      if (Number.isFinite(low) && Number.isFinite(high)) {
        if (code) this.byKey.set(code, { low, high });
        if (name) this.byKey.set(name, { low, high });
      }
    }
  }

  /**
   * nameOrCode: اسم الصاد (Amikacin) أو الاختصار (AK)
   * يرجّع { low, high } أو يرمي NotFoundException إذا ما لقى شيء.
   */
  getBreakpoints(nameOrCode: string): Breakpoints {
    const key = nameOrCode?.trim().toLowerCase();
    if (!key) {
      throw new NotFoundException('الاسم/الاختصار مطلوب');
    }
    const found = this.byKey.get(key);
    if (!found) {
      throw new NotFoundException(`ما لقيت صاد بالاسم/الاختصار: ${nameOrCode}`);
    }
    return found;
  }
}
