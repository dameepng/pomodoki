import bcrypt from "bcryptjs";

import { BCRYPT_ROUNDS } from "@/core/constants/index.js";

export class HashService {
  async hash(plainText) {
    return bcrypt.hash(plainText, BCRYPT_ROUNDS);
  }

  async compare(plainText, hashedText) {
    return bcrypt.compare(plainText, hashedText);
  }
}

export const hashService = new HashService();

export default hashService;
