import { SignJWT, jwtVerify } from "jose";

import env from "@/config/env.js";
import { JWT_EXPIRY } from "@/core/constants/index.js";

export class JwtService {
  async generateToken(payload) {
    const secret = new TextEncoder().encode(env.jwtSecret);

    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(JWT_EXPIRY)
      .sign(secret);
  }

  async verifyToken(token) {
    try {
      const secret = new TextEncoder().encode(env.jwtSecret);
      const { payload } = await jwtVerify(token, secret);

      return {
        userId: payload.userId,
        username: payload.username,
      };
    } catch {
      return null;
    }
  }
}

export const jwtService = new JwtService();

export default jwtService;
