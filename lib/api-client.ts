/**
 * Central API client for all backend communications
 * Handles .NET API integration with proper error handling and debugging
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5090"

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  status: number
  details?: unknown
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    console.log("[v0] ApiClient initialized with baseUrl:", this.baseUrl)
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return headers
  }

  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    }

    console.log("[v0] API Request:", {
      url,
      method: config.method || "GET",
      hasBody: !!config.body,
    })

    try {
      const response = await fetch(url, config)

      console.log("[v0] API Response:", {
        url,
        status: response.status,
        statusText: response.statusText,
      })

      // Handle empty responses
      if (response.status === 204) {
        return {} as T
      }

      const contentType = response.headers.get("content-type")
      let data: unknown

      if (contentType?.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        const errorMessage = this.extractErrorMessage(data, response.status)
        console.error("[v0] API Error:", {
          status: response.status,
          message: errorMessage,
          data,
        })

        throw {
          message: errorMessage,
          status: response.status,
          details: data,
        } as ApiError
      }

      return data as T
    } catch (error) {
      const apiError = this.handleError(error, url)
      console.error("[v0] Request failed:", apiError)
      throw apiError
    }
  }

  private extractErrorMessage(data: unknown, status: number): string {
    // Handle .NET API error responses
    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>
      if (obj.message) return String(obj.message)
      if (obj.title) return String(obj.title)
      if (obj.error) return String(obj.error)
    }

    if (typeof data === "string") {
      return data || `HTTP ${status}`
    }

    return `HTTP ${status}: ${this.getStatusMessage(status)}`
  }

  private getStatusMessage(status: number): string {
    const messages: Record<number, string> = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      422: "Unprocessable Entity",
      500: "Internal Server Error",
      503: "Service Unavailable",
    }

    return messages[status] || "Unknown Error"
  }

  private handleError(error: unknown, url: string): ApiError {
    if (error && typeof error === "object" && "message" in error) {
      return error as ApiError
    }

    if (error instanceof TypeError) {
      if (error.message === "Failed to fetch") {
        return {
          message: `Cannot connect to API at ${this.baseUrl}. Ensure the backend is running.`,
          status: 0,
          details: error.message,
        }
      }

      if (error.message.includes("CORS")) {
        return {
          message: "CORS error: Backend must allow requests from your frontend origin.",
          status: 0,
          details: error.message,
        }
      }

      return {
        message: error.message || "Network error occurred",
        status: 0,
        details: error,
      }
    }

    return {
      message: "An unexpected error occurred",
      status: 0,
      details: error,
    }
  }

  // Authentication methods
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
      console.log("[v0] Token stored")
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      console.log("[v0] Token cleared")
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Public API methods
  async get<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Auth API endpoints (using Next.js local routes for database access)
const localApiClient = new ApiClient(typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    localApiClient.post("/api/auth/register", data),

  login: (data: { email: string; password: string }) =>
    localApiClient.post<{ token: string; user: unknown }>("/api/auth/login", data),

  logout: () => {
    apiClient.clearToken()
    return Promise.resolve()
  },

  getCurrentUser: () => localApiClient.get("/api/auth/me"),
}

// Crop prediction API endpoints
export const cropApi = {
  predict: (data: unknown) => apiClient.post("/api/crop/predict", data),

  getPredictionHistory: () => apiClient.get("/api/crop/predictions"),

  getPredictionById: (id: string) => apiClient.get(`/api/crop/predictions/${id}`),
}

// Weather API endpoints (if integrating with external service)
export const weatherApi = {
  getCurrentWeather: (latitude: number, longitude: number) =>
    apiClient.get(`/api/weather?lat=${latitude}&lon=${longitude}`),
}
