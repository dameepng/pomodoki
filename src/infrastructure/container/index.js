import registerUseCase from "@/application/auth/register.usecase.js";
import loginUseCase from "@/application/auth/login.usecase.js";
import getCurrentUserUseCase from "@/application/auth/get-current-user.usecase.js";
import userRepository from "@/infrastructure/repositories/user.repository.js";
import hashService from "@/infrastructure/services/hash.service.js";
import jwtService from "@/infrastructure/services/jwt.service.js";

export {
  hashService,
  jwtService,
  userRepository,
  registerUseCase,
  loginUseCase,
  getCurrentUserUseCase,
};

export default {
  hashService,
  jwtService,
  userRepository,
  registerUseCase,
  loginUseCase,
  getCurrentUserUseCase,
};
