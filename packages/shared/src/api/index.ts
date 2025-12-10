// API Client exports
export { apiClient, createApiClient } from './client'
export type { 
  ApiClientConfig, 
  ApiResponse, 
  RequestOptions,
  Interceptors,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './client'

// Pre-built interceptors
export {
  consoleLoggingInterceptors,
  createSlowRequestInterceptor,
  createRequestCounterInterceptor,
  createHeaderInterceptor,
} from './interceptors'

// Circuit Breaker
export {
  CircuitBreaker,
  CircuitBreakerError,
  createCircuitBreaker,
} from './circuitBreaker'
export type { CircuitState, CircuitBreakerOptions } from './circuitBreaker'
