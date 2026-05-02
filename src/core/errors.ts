/**
 * @module core/errors
 * @description Advanced Object-Oriented Error Hierarchy for strict error tracking and routing.
 */

/**
 * Base Application Error
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly timestamp: number;
  public readonly isRecoverable: boolean;

  constructor(message: string, code: string = 'APP_ERROR', isRecoverable: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.isRecoverable = isRecoverable;
    this.timestamp = Date.now();
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }
}

/**
 * Network / API Communication Error
 */
export class NetworkError extends AppError {
  public readonly status: number;

  constructor(message: string, status: number = 500) {
    super(message, 'NETWORK_ERROR', true);
    this.name = 'NetworkError';
    this.status = status;
  }
}

/**
 * AI Provider / Generation Error
 */
export class AIProviderError extends AppError {
  public readonly provider: string;

  constructor(message: string, provider: string = 'GEMINI') {
    super(message, 'AI_PROVIDER_ERROR', false);
    this.name = 'AIProviderError';
    this.provider = provider;
  }
}

/**
 * User Input / Validation Error
 */
export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', true);
    this.name = 'ValidationError';
    this.field = field;
  }
}
