export class DomainError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "DomainError";
    this.code = code;
  }
}

export class NotFoundError extends DomainError {
  constructor(entity) {
    super(`${entity} not found`, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends DomainError {
  constructor(message) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends DomainError {
  constructor(message = "Authentication failed") {
    super(message, "AUTH_ERROR");
    this.name = "AuthenticationError";
  }
}

export class ConflictError extends DomainError {
  constructor(message) {
    super(message, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Access forbidden") {
    super(message, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}
