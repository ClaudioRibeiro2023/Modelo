/**
 * Pre-built interceptors for common use cases
 */
/* eslint-disable no-console */
import type { RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from './client'

/**
 * Console logging interceptor - logs all requests/responses to console
 * Use in development only
 */
export const consoleLoggingInterceptors = {
  request: [
    ({ method, url, body }) => {
      console.log(`[API] → ${method} ${url}`, body ? { body } : '')
    },
  ] as RequestInterceptor[],
  
  response: [
    ({ method, url, status, durationMs }) => {
      const emoji = status >= 200 && status < 300 ? '✓' : '✗'
      console.log(`[API] ${emoji} ${method} ${url} - ${status} (${durationMs.toFixed(0)}ms)`)
    },
  ] as ResponseInterceptor[],
  
  error: [
    ({ method, url, error, durationMs }) => {
      console.error(`[API] ✗ ${method} ${url} - Error: ${error.message} (${durationMs.toFixed(0)}ms)`)
    },
  ] as ErrorInterceptor[],
}

/**
 * Performance monitoring interceptor - logs slow requests
 */
export function createSlowRequestInterceptor(thresholdMs = 1000): ResponseInterceptor {
  return ({ method, url, status, durationMs }) => {
    if (durationMs > thresholdMs) {
      console.warn(`[API] Slow request: ${method} ${url} - ${status} (${durationMs.toFixed(0)}ms)`)
    }
  }
}

/**
 * Request counting interceptor - tracks API usage
 */
export function createRequestCounterInterceptor() {
  let requestCount = 0
  let errorCount = 0
  
  return {
    request: [
      () => {
        requestCount++
      },
    ] as RequestInterceptor[],
    
    error: [
      () => {
        errorCount++
      },
    ] as ErrorInterceptor[],
    
    getStats: () => ({ requestCount, errorCount }),
    reset: () => {
      requestCount = 0
      errorCount = 0
    },
  }
}

/**
 * Custom header interceptor - adds custom headers to all requests
 */
export function createHeaderInterceptor(
  headers: Record<string, string> | (() => Record<string, string>)
): RequestInterceptor {
  return (config) => {
    const newHeaders = typeof headers === 'function' ? headers() : headers
    Object.assign(config.headers, newHeaders)
  }
}
