import { COOKIE_NAME } from "@/core/constants/index.js";
import jwtService from "@/infrastructure/services/jwt.service.js";

export async function getAuthUser(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return jwtService.verifyToken(token);
}
