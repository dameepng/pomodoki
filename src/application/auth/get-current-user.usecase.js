import { AuthenticationError } from "@/core/errors/domain.errors.js";
import userRepository from "@/infrastructure/repositories/user.repository.js";
import jwtService from "@/infrastructure/services/jwt.service.js";

export class GetCurrentUserUseCase {
  constructor() {
    this.dependencies = {
      userRepository,
      jwtService,
      AuthenticationError,
    };
  }

  async execute(token) {
    const { userRepository, jwtService, AuthenticationError } =
      this.dependencies;

    if (!token) {
      throw new AuthenticationError();
    }

    const payload = await jwtService.verifyToken(token);

    if (!payload?.userId) {
      throw new AuthenticationError();
    }

    const user = await userRepository.findByIdWithoutPassword(payload.userId);

    if (!user) {
      throw new AuthenticationError();
    }

    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}

const getCurrentUserUseCase = new GetCurrentUserUseCase();

export default getCurrentUserUseCase;
