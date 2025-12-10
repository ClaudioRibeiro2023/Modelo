/**
 * Circuit Breaker Pattern Implementation
 * 
 * Prevents cascading failures by temporarily blocking requests to a failing service.
 * 
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service is failing, requests are blocked
 * - HALF_OPEN: Testing if service recovered
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export interface CircuitBreakerOptions {
  /** Number of failures before opening circuit (default: 5) */
  failureThreshold?: number
  /** Time in ms to wait before trying again (default: 30000) */
  resetTimeout?: number
  /** Number of successful calls in HALF_OPEN to close circuit (default: 2) */
  successThreshold?: number
  /** Optional callback when state changes */
  onStateChange?: (from: CircuitState, to: CircuitState) => void
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED'
  private failureCount = 0
  private successCount = 0
  private lastFailureTime: number | null = null
  
  private readonly failureThreshold: number
  private readonly resetTimeout: number
  private readonly successThreshold: number
  private readonly onStateChange?: (from: CircuitState, to: CircuitState) => void

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5
    this.resetTimeout = options.resetTimeout ?? 30000
    this.successThreshold = options.successThreshold ?? 2
    this.onStateChange = options.onStateChange
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.transitionTo('HALF_OPEN')
      } else {
        throw new CircuitBreakerError('Circuit is OPEN - request blocked')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  /**
   * Check if request is allowed (without executing)
   */
  isAllowed(): boolean {
    if (this.state === 'CLOSED') return true
    if (this.state === 'HALF_OPEN') return true
    if (this.state === 'OPEN' && this.shouldAttemptReset()) {
      this.transitionTo('HALF_OPEN')
      return true
    }
    return false
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    return this.state
  }

  /**
   * Get circuit stats
   */
  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    }
  }

  /**
   * Manually reset the circuit to CLOSED
   */
  reset(): void {
    this.transitionTo('CLOSED')
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = null
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++
      if (this.successCount >= this.successThreshold) {
        this.transitionTo('CLOSED')
        this.failureCount = 0
        this.successCount = 0
      }
    } else if (this.state === 'CLOSED') {
      // Reset failure count on success
      this.failureCount = 0
    }
  }

  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.state === 'HALF_OPEN') {
      this.transitionTo('OPEN')
      this.successCount = 0
    } else if (this.state === 'CLOSED' && this.failureCount >= this.failureThreshold) {
      this.transitionTo('OPEN')
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true
    return Date.now() - this.lastFailureTime >= this.resetTimeout
  }

  private transitionTo(newState: CircuitState): void {
    if (this.state !== newState) {
      const oldState = this.state
      this.state = newState
      this.onStateChange?.(oldState, newState)
    }
  }
}

/**
 * Error thrown when circuit is open
 */
export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CircuitBreakerError'
  }
}

/**
 * Create a circuit breaker with default options
 */
export function createCircuitBreaker(options?: CircuitBreakerOptions): CircuitBreaker {
  return new CircuitBreaker(options)
}
