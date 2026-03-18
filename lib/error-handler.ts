/**
 * Centralized error handling utilities
 * Standardizes error messages and logging across the application
 */

export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: string
}

export class ErrorHandler {
  static isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError) {
      return error.message === "Failed to fetch" || error.message.includes("network")
    }
    return false
  }

  static isCorsError(error: unknown): boolean {
    if (error instanceof TypeError) {
      return error.message.includes("CORS") || error.message.includes("cross-origin")
    }
    return false
  }

  static isAuthError(error: unknown): boolean {
    if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>
      return (
        (err.status === 401 || err.status === 403) ||
        (err.message && String(err.message).includes("Unauthorized"))
      )
    }
    return false
  }

  static isValidationError(error: unknown): boolean {
    if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>
      return err.status === 422 || err.status === 400
    }
    return false
  }

  static createUserFriendlyMessage(error: unknown): string {
    // Network errors
    if (this.isNetworkError(error)) {
      return "Unable to connect to the server. Please check your internet connection and try again."
    }

    // CORS errors
    if (this.isCorsError(error)) {
      return "Server configuration error. Please contact support if the problem persists."
    }

    // Auth errors
    if (this.isAuthError(error)) {
      return "Your session has expired. Please log in again."
    }

    // Validation errors
    if (this.isValidationError(error)) {
      if (typeof error === "object" && error !== null) {
        const err = error as Record<string, unknown>
        if (err.message) return String(err.message)
      }
      return "Please check your input and try again."
    }

    // Generic error message
    if (error instanceof Error) {
      return error.message || "An unexpected error occurred. Please try again."
    }

    if (typeof error === "string") {
      return error
    }

    return "An unexpected error occurred. Please try again."
  }

  static createAppError(error: unknown): AppError {
    const timestamp = new Date().toISOString()

    // Already an AppError
    if (typeof error === "object" && error !== null && "code" in error) {
      return error as AppError
    }

    // Network error
    if (this.isNetworkError(error)) {
      return {
        code: "NETWORK_ERROR",
        message: this.createUserFriendlyMessage(error),
        details: error,
        timestamp,
      }
    }

    // CORS error
    if (this.isCorsError(error)) {
      return {
        code: "CORS_ERROR",
        message: this.createUserFriendlyMessage(error),
        details: error,
        timestamp,
      }
    }

    // Auth error
    if (this.isAuthError(error)) {
      return {
        code: "AUTH_ERROR",
        message: this.createUserFriendlyMessage(error),
        details: error,
        timestamp,
      }
    }

    // API error
    if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>
      return {
        code: `HTTP_${err.status || "UNKNOWN"}`,
        message: this.createUserFriendlyMessage(error),
        details: error,
        timestamp,
      }
    }

    // Generic error
    return {
      code: "UNKNOWN_ERROR",
      message: this.createUserFriendlyMessage(error),
      details: error,
      timestamp,
    }
  }

  static logError(error: unknown, context?: string): void {
    const appError = this.createAppError(error)

    console.error(`[v0] ${context || "Error"} [${appError.code}]:`, {
      message: appError.message,
      details: appError.details,
      timestamp: appError.timestamp,
    })
  }

  static logWarning(message: string, context?: string): void {
    console.warn(`[v0] ${context || "Warning"}: ${message}`)
  }

  static logInfo(message: string, context?: string): void {
    console.log(`[v0] ${context || "Info"}: ${message}`)
  }
}

/**
 * Retry logic for transient failures
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    delayMs?: number
    backoffMultiplier?: number
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3
  const delayMs = options.delayMs ?? 1000
  const backoffMultiplier = options.backoffMultiplier ?? 2

  let lastError: Error | null = null
  let currentDelay = delayMs

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxRetries) {
        ErrorHandler.logWarning(
          `Attempt ${attempt + 1} failed, retrying in ${currentDelay}ms...`,
          `Retry Logic`
        )
        await new Promise((resolve) => setTimeout(resolve, currentDelay))
        currentDelay *= backoffMultiplier
      }
    }
  }

  throw lastError
}

/**
 * Timeout wrapper for async operations
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ])
}
