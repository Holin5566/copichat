"use client"

import { createContext, useCallback, useContext, useState } from "react"

enum Role {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest"
}

interface IUserProfile {
  userName: string
  email: string
  avatarUrl: string // `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
  bio: string
}
const emptyProfile: IUserProfile = {
  userName: "",
  email: "",
  avatarUrl: "",
  bio: ""
}
interface IAuthContextType {
  role: Role
  userId: string | null
  createdAt: Date | null
  isAuthenticated: boolean
  profile: IUserProfile

  lastLoginAt: Date | null
  //TODO - tokens
  //   accessToken: string | null
  //   refreshToken: string | null
  //   tokenExpiry: Date | null
  //TODO - email verified
  //   isEmailVerified: boolean

  login: (userName: string, password: string) => Promise<void>
  guestLogin: (guestName: string) => Promise<void>
  logout: () => void
  signup: (userName: string, email: string, password: string) => Promise<void>
  updateProfile: (data: IUserProfile) => Promise<void>
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(Role.GUEST)
  const [userId, setUserId] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState<Date | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [profile, setProfile] = useState<IUserProfile>(emptyProfile)
  const [lastLoginAt, setLastLoginAt] = useState<Date | null>(null)

  const errorHandler = (error: unknown) => {
    console.error(error)
    alert("server error!")
    setRole(Role.GUEST)
    setUserId(null)
    setCreatedAt(null)
    setIsAuthenticated(false)
    setProfile(emptyProfile)
    setLastLoginAt(null)
  }

  const login = useCallback(async (userName: string, password: string) => {
    try {
      await mockAsyncRequest(userName, password)
      setRole(Role.USER)
      setUserId("user-" + Math.random())
      setCreatedAt(new Date(Date.now() - Math.random() * 1000000000))
      setIsAuthenticated(true)
      setProfile({
        userName,
        email: `${userName}@example.com`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
        bio: "這是一個登入的使用者簡介範例。"
      })
      setLastLoginAt(new Date())
    } catch (error) {
      errorHandler(error)
    }
  }, [])

  const guestLogin = useCallback(async (guestName: string) => {
    try {
      await mockAsyncRequest(guestName)
      setRole(Role.GUEST)
      setUserId("guest-" + Math.random())
      setCreatedAt(new Date())
      setIsAuthenticated(true)
      setProfile({
        userName: guestName,
        email: "",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestName}`,
        bio: "這是一個遊客使用者簡介範例。"
      })
      setLastLoginAt(new Date())
    } catch (error) {
      errorHandler(error)
    }
  }, [])

  const logout = useCallback(() => {
    setRole(Role.GUEST)
    setUserId(null)
    setCreatedAt(null)
    setIsAuthenticated(false)
    setProfile(emptyProfile)
    setLastLoginAt(null)
    mockAsyncRequest().catch((error) => console.error(error))
  }, [])

  const signup = useCallback(async (userName: string, email: string, password: string) => {
    try {
      await mockAsyncRequest(userName, email, password)
      setRole(Role.USER)
      setUserId("user-" + Math.random())
      setCreatedAt(new Date())
      setIsAuthenticated(true)
      setProfile({
        userName,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
        bio: "這是一個註冊的使用者簡介範例。"
      })
      setLastLoginAt(new Date())
    } catch (error) {
      errorHandler(error)
    }
  }, [])

  const updateProfile = useCallback(async (data: IUserProfile) => {
    try {
      await mockAsyncRequest(data)
      setProfile(data)
    } catch (error) {
      errorHandler(error)
    }
  }, [])

  const value: IAuthContextType = {
    role,
    userId,
    createdAt,
    isAuthenticated,
    profile,
    lastLoginAt,
    login,
    guestLogin,
    logout,
    signup,
    updateProfile
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = (): IAuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

async function mockAsyncRequest(...data: unknown[]): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 100)
  })
}
