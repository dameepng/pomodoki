import {
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/core/constants/index.js";
import {
  AuthenticationError,
  ValidationError,
} from "@/core/errors/domain.errors.js";
import userRepository from "@/infrastructure/repositories/user.repository.js";
import hashService from "@/infrastructure/services/hash.service.js";
import jwtService from "@/infrastructure/services/jwt.service.js";

export class LoginUseCase {
  constructor() {
    this.dependencies = {
      userRepository,
      hashService,
      jwtService,
      AuthenticationError,
      ValidationError,
      MIN_USERNAME_LENGTH,
      MIN_PASSWORD_LENGTH,
    };
  }

  async execute({ username, password }) {
    const {
      userRepository,
      hashService,
      jwtService,
      AuthenticationError,
      ValidationError,
      MIN_USERNAME_LENGTH,
      MIN_PASSWORD_LENGTH,
    } = this.dependencies;
    const normalizedUsername = String(username ?? "").trim();
    const normalizedPassword = String(password ?? "");
    const invalidCredentialsMessage = "Username atau password salah";

    if (!normalizedUsername) {
      throw new ValidationError("Username tidak boleh kosong");
    }

    if (!normalizedPassword) {
      throw new ValidationError("Password tidak boleh kosong");
    }

    if (normalizedUsername.length < MIN_USERNAME_LENGTH) {
      throw new ValidationError(
        `Username minimal ${MIN_USERNAME_LENGTH} karakter`,
      );
    }

    if (normalizedPassword.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError(
        `Password minimal ${MIN_PASSWORD_LENGTH} karakter`,
      );
    }

    const user = await userRepository.findByUsername(normalizedUsername);

    if (!user) {
      throw new AuthenticationError(invalidCredentialsMessage);
    }

    const isPasswordValid = await hashService.compare(
      normalizedPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AuthenticationError(invalidCredentialsMessage);
    }

    const token = await jwtService.generateToken({
      userId: user.id,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  }
}

const loginUseCase = new LoginUseCase();

export default loginUseCase;
