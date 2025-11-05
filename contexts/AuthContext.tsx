"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    email: string
    role: 'admin' | 'operator' | 'user'
    firstName?: string
    lastName?: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Проверка токена при загрузке
    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setToken(storedToken)
                setUser(parsedUser)
            } catch (error) {
                console.error('Failed to parse stored user:', error)
                localStorage.removeItem('adminToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')
            }
        }

        setIsLoading(false)
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        try {
            const response = await fetch('http://176.88.248.139/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Login failed' }))
                throw new Error(errorData.message || 'Invalid credentials')
            }

            const data = await response.json()

            // Бэкенд возвращает: { success: true, data: { user, tokens: { accessToken, refreshToken } } }
            if (data.success && data.data) {
                const { user: userData, tokens } = data.data

                // Сохраняем токены
                localStorage.setItem('adminToken', tokens.accessToken)
                if (tokens.refreshToken) {
                    localStorage.setItem('refreshToken', tokens.refreshToken)
                }
                localStorage.setItem('user', JSON.stringify(userData))

                setToken(tokens.accessToken)
                setUser(userData)

                // Перенаправляем на dashboard
                router.push('/dashboard')
            } else {
                throw new Error('Invalid response format')
            }
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }, [router])

    const logout = useCallback(() => {
        // Очищаем локальное хранилище
        localStorage.removeItem('adminToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        setToken(null)
        setUser(null)

        // Перенаправляем на главную страницу (логин)
        router.push('/')
    }, [router])

    const refreshToken = useCallback(async (): Promise<boolean> => {
        try {
            const storedRefreshToken = localStorage.getItem('refreshToken')

            if (!storedRefreshToken) {
                return false
            }

            const response = await fetch('http://176.88.248.139/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
            })

            if (!response.ok) {
                return false
            }

            const data = await response.json()

            if (data.success && data.data?.accessToken) {
                const newAccessToken = data.data.accessToken
                localStorage.setItem('adminToken', newAccessToken)
                setToken(newAccessToken)
                return true
            }

            return false
        } catch (error) {
            console.error('Token refresh error:', error)
            return false
        }
    }, [])

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        refreshToken,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
