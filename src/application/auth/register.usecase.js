import {
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/core/constants/index.js";
import {
  ConflictError,
  ValidationError,
} from "@/core/errors/domain.errors.js";
import userRepository from "@/infrastructure/repositories/user.repository.js";
import hashService from "@/infrastructure/services/hash.service.js";
import jwtService from "@/infrastructure/services/jwt.service.js";

export class RegisterUseCase {
  constructor() {
    this.dependencies = {
      userRepository,
      hashService,
      jwtService,
      ValidationError,
      ConflictError,
      MIN_USERNAME_LENGTH,
      MAX_USERNAME_LENGTH,
      MIN_PASSWORD_LENGTH,
    };
  }

  async execute({ username, password }) {
    const {
      userRepository,
      hashService,
      jwtService,
      ValidationError,
      ConflictError,
      MIN_USERNAME_LENGTH,
      MAX_USERNAME_LENGTH,
      MIN_PASSWORD_LENGTH,
    } = this.dependencies;
    const normalizedUsername = String(username ?? "").trim();
    const normalizedPassword = String(password ?? "");

    if (normalizedUsername.length < MIN_USERNAME_LENGTH) {
      throw new ValidationError(
        `Username minimal ${MIN_USERNAME_LENGTH} karakter`,
      );
    }

    if (normalizedUsername.length > MAX_USERNAME_LENGTH) {
      throw new ValidationError(
        `Username maksimal ${MAX_USERNAME_LENGTH} karakter`,
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      throw new ValidationError(
        "Username hanya boleh berisi huruf, angka, dan underscore",
      );
    }

    if (normalizedPassword.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError(
        `Password minimal ${MIN_PASSWORD_LENGTH} karakter`,
      );
    }

    const usernameExists = await userRepository.existsByUsername(
      normalizedUsername,
    );

    if (usernameExists) {
      throw new ConflictError("Username sudah digunakan");
    }

    const hashedPassword = await hashService.hash(normalizedPassword);
    const user = await userRepository.create({
      username: normalizedUsername,
      password: hashedPassword,
    });

    if (!user) {
      throw new ValidationError("Registrasi gagal");
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

const registerUseCase = new RegisterUseCase();

export default registerUseCase;
