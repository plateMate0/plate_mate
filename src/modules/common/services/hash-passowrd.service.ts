import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordService {
  constructor() {}

  private readonly _saltRounds = 10; // Adjust salt rounds as needed

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this._saltRounds);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
