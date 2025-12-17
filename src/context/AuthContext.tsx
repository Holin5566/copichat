"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

enum Role {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest"
}

interface IUserProfile {
  userName: string
  email: string
  avatarUrl: string
  bio: string
}

interface IUser {
  userId: string
  userName: string
  password: string
  email: string
  bio: string
  createdAt: string
}

// 假資料：預設帳號資料庫
const defaultMockUsers: IUser[] = [
  {
    userId: "user-001",
    userName: "alice",
    password: "123456",
    email: "alice@example.com",
    bio: "Alice 的個人簡介",
    createdAt: "2025-01-01"
  },
  {
    userId: "user-002",
    userName: "bob",
    password: "123456",
    email: "bob@example.com",
    bio: "Bob 的個人簡介",
    createdAt: "2025-01-02"
  },
  {
    userId: "user-003",
    userName: "charlie",
    password: "123456",
    email: "charlie@example.com",
    bio: "Charlie 的個人簡介",
    createdAt: "2025-01-03"
  }
]

const STORAGE_KEY = "chat_users"

// 初始化 localStorage 中的使用者資料
const initializeUsers = (): IUser[] => {
  if (typeof window === "undefined") {
    return defaultMockUsers
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsedUsers = JSON.parse(stored)
      // 合併預設使用者和已註冊的使用者
      const defaultUserNames = defaultMockUsers.map((u) => u.userName)
      const registeredUsers = parsedUsers.filter((u: IUser) => !defaultUserNames.includes(u.userName))
      return [...defaultMockUsers, ...registeredUsers]
    } catch {
      return defaultMockUsers
    }
  }
  return defaultMockUsers
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
  const [users, setUsers] = useState<IUser[]>([])

  // 初始化使用者資料
  useEffect(() => {
    const initialUsers = initializeUsers()
    setUsers(initialUsers)
  }, [])

  const errorHandler = (error: any) => {
    console.error(error)
    alert(error instanceof Error ? error.message : "server error!")
    setRole(Role.GUEST)
    setUserId(null)
    setCreatedAt(null)
    setIsAuthenticated(false)
    setProfile(emptyProfile)
    setLastLoginAt(null)
  }

  const login = useCallback(
    async (userName: string, password: string) => {
      try {
        await mockAsyncRequest()

        // 驗證帳號密碼
        const user = users.find((u) => u.userName === userName && u.password === password)

        if (!user) {
          throw new Error("帳號或密碼錯誤")
        }

        // 登入成功
        setRole(Role.USER)
        setUserId(user.userId)
        setCreatedAt(new Date(user.createdAt))
        setIsAuthenticated(true)
        setProfile({
          userName: user.userName,
          email: user.email,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`,
          bio: user.bio
        })
        setLastLoginAt(new Date())
      } catch (error) {
        errorHandler(error)
      }
    },
    [users]
  )

  const guestLogin = useCallback(async (guestName: string) => {
    try {
      await mockAsyncRequest()
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

  const signup = useCallback(
    async (userName: string, email: string, password: string) => {
      try {
        // 驗證輸入
        if (!userName || !email || !password) {
          throw new Error("所有欄位都是必須的")
        }

        if (userName.length < 3) {
          throw new Error("使用者名稱至少需要 3 個字元")
        }

        if (password.length < 6) {
          throw new Error("密碼至少需要 6 個字元")
        }

        // 驗證信箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          throw new Error("信箱格式無效")
        }

        await mockAsyncRequest()

        // 檢查使用者名稱和信箱是否已存在
        const existingUser = users.find((u) => u.userName === userName || u.email === email)
        if (existingUser) {
          throw new Error("使用者名稱或信箱已被使用")
        }

        // 建立新使用者
        const newUser: IUser = {
          userId: "user-" + Date.now(),
          userName,
          email,
          password, // 注意：在實際應用中應該進行密碼雜湊處理
          bio: "這是一個新註冊的使用者簡介。",
          createdAt: new Date().toISOString()
        }

        // 保存到 localStorage
        const updatedUsers = [...users, newUser]
        setUsers(updatedUsers)

        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers))
        }

        // 自動登入
        setRole(Role.USER)
        setUserId(newUser.userId)
        setCreatedAt(new Date(newUser.createdAt))
        setIsAuthenticated(true)
        setProfile({
          userName: newUser.userName,
          email: newUser.email,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.userName}`,
          bio: newUser.bio
        })
        setLastLoginAt(new Date())
      } catch (error) {
        errorHandler(error)
      }
    },
    [users]
  )

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

async function mockAsyncRequest(...data: any[]): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 100)
  })
}
