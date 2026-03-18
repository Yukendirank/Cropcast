"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { apiClient, authApi } from "./api-client"

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  clearError: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const currentUser = await authApi.getCurrentUser()
          setUser(currentUser as User)
          console.log("[v0] User loaded from session")
        } catch (err) {
          console.log("[v0] Session expired, clearing token")
          apiClient.clearToken()
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.login({ email, password })
      const data = response as { token: string; user: User }

      apiClient.setToken(data.token)
      setUser(data.user)
      console.log("[v0] User logged in:", data.user.email)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      setError(errorMessage)
      console.error("[v0] Login error:", errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await authApi.register({ email, password, name })
      // Auto-login after registration
      await login(email, password)
      console.log("[v0] User registered and logged in")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed"
      setError(errorMessage)
      console.error("[v0] Registration error:", errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [login])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
    setError(null)
    console.log("[v0] User logged out")
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
