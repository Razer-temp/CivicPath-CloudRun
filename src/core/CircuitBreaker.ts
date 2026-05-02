/**
 * @module core/CircuitBreaker
 * @description Enterprise-grade Circuit Breaker pattern to protect against cascading API failures.
 */

import { logger } from '../utils/logger';
import { AppError } from './errors';

export enum CircuitState {
  CLOSED, // Normal operation, requests flow freely
  OPEN,   // Service failing, requests blocked immediately
  HALF_OPEN // Testing recovery, allow limited requests
}

interface CircuitBreakerOptions {
  failureThreshold?: number; // How many failures before opening
  resetTimeoutMs?: number;   // How long to wait before trying again
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private nextAttempt: number = Date.now();

  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(public readonly name: string, options?: CircuitBreakerOptions) {
    this.failureThreshold = options?.failureThreshold || 3;
    this.resetTimeoutMs = options?.resetTimeoutMs || 30000;
  }

  /**
   * Executes an async task with Circuit Breaker protection
   * @complexity O(1) Time, O(1) Space
   */
  public async execute<T>(task: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() > this.nextAttempt) {
        // Transition to half-open to test the waters
        this.state = CircuitState.HALF_OPEN;
        logger.info(`[CircuitBreaker] ${this.name} state changed from OPEN to HALF_OPEN`);
      } else {
        throw new AppError(`Circuit breaker OPEN for ${this.name}. Service unavailable.`, 'CIRCUIT_OPEN', false);
      }
    }

    try {
      const result = await task();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      logger.info(`[CircuitBreaker] ${this.name} recovered. State changed to CLOSED.`);
    }
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(error: Error): void {
    this.failureCount++;
    logger.warn(`[CircuitBreaker] ${this.name} failure ${this.failureCount}/${this.failureThreshold}: ${error.message}`);

    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.resetTimeoutMs;
      logger.error(`[CircuitBreaker] ${this.name} threshold reached! State changed to OPEN.`);
    }
  }
}
