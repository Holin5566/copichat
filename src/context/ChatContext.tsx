"use client"

import { useSocket } from "@/hooks/useSocket"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

interface IMessage {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
  avatar?: string
}

interface IUser {
  id: string
  name: string
  avatar?: string
  joinedAt: Date
}

/**
 * ChatContext 值的型別定義
 */
interface IChatContextType {
  // 狀態值
  messages: IMessage[]
  users: IUser[]
  currentUser: IUser | null
  bot: IUser | null
  isLoading: boolean

  // 方法
  sendMessage: (content: string) => void
  joinChat: (userName: string, isSelf: boolean) => void
  leaveChat: () => void
  clearMessages: () => void
}

/**
 * 建立 ChatContext
 * 用於全應用狀態管理
 */
const ChatContext = createContext<IChatContextType | undefined>(undefined)

/**
 * ChatProvider 元件
 * 提供聊天室的狀態和功能給所有子元件
 */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  // 訊息狀態
  const [messages, setMessages] = useState<IMessage[]>([])

  // 線上使用者狀態
  const [users, setUsers] = useState<IUser[]>([])

  // 當前使用者狀態
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)

  const [bot, setBot] = useState<IUser | null>(null)

  // 載入狀態
  const [isLoading, setIsLoading] = useState(false)

  const room = useSocket()

  /**
   * 發送訊息函數
   * - 驗證使用者和內容
   * - 建立訊息物件
   * - 添加到訊息列表
   */
  const sendMessage = useCallback(
    (content: string) => {
      // 檢查使用者是否已加入聊天室
      if (!currentUser) {
        console.warn("使用者未登入")
        return
      }

      // 檢查訊息內容是否為空
      if (!content.trim()) {
        console.warn("訊息內容不能為空")
        return
      }

      room.sendMessage(content.trim())
    },
    [currentUser]
  )

  /**
   * 加入聊天室函數
   * - 建立使用者物件
   * - 設定當前使用者
   * - 添加到線上使用者列表
   * - 發送系統訊息
   */
  const joinChat = useCallback((userName: string, isSelf: boolean = false) => {
    // 檢查使用者名稱
    if (!userName.trim()) {
      console.warn("使用者名稱不能為空")
      return
    }

    // 建立新使用者物件
    const newUser: IUser = {
      id: `user-${Date.now()}`,
      name: userName.trim(),
      joinedAt: new Date(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
    }

    if (isSelf) {
      setCurrentUser(newUser)
    }
    room.joinChat(newUser.name)
    // // 添加到線上使用者列表
    // setUsers((prev) => [...prev, newUser])

    // // 發送系統訊息
    // const systemMessage: IMessage = {
    //   id: `sys-${Date.now()}`,
    //   userId: "system",
    //   userName: "系統",
    //   content: `${userName} 加入了聊天室`,
    //   timestamp: new Date()
    // }
    // setMessages((prev) => [...prev, systemMessage])
  }, [])

  /**
   * 離開聊天室函數
   * - 移除使用者
   * - 清空當前使用者
   * - 發送系統訊息
   */
  const leaveChat = useCallback(() => {
    if (!currentUser) {
      return
    }

    const userName = currentUser.name
    // 清空當前使用者
    setCurrentUser(null)

    // 發送系統訊息
    const systemMessage: IMessage = {
      id: `sys-${Date.now()}`,
      userId: "system",
      userName: "系統",
      content: `${userName} 離開了聊天室`,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, systemMessage])
  }, [currentUser])

  /**
   * 清空訊息函數
   * - 清空所有聊天訊息
   * 用於重置聊天室
   */
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  // 監聽 WebSocket 訊息事件
  useEffect(() => {
    if (!room.socket) return

    // 監聽 chat:message 事件
    room.socket.on("chat:message", (message: IMessage) => {
      console.log("收到訊息:", message)
      setMessages((prev) => [...prev, message])
    })

    // 監聽 user:joined 事件
    room.socket.on("user:joined", (data: { user: IUser; users: IUser[] }) => {
      console.log("用戶加入:", data.user.name)
      setUsers(data.users)
    })

    // 監聽 user:left 事件
    room.socket.on("user:left", (data: { user: IUser; users: IUser[] }) => {
      console.log("用戶離開:", data.user.name)
      setUsers(data.users)
    })

    // 監聽 chat:history 事件
    room.socket.on("chat:history", (history: IMessage[]) => {
      console.log("收到聊天歷史:", history.length, "條訊息")
      setMessages(history)
    })

    // 清理監聽
    return () => {
      room.socket?.off("chat:message")
      room.socket?.off("user:joined")
      room.socket?.off("user:left")
      room.socket?.off("chat:history")
    }
  }, [room.socket])

  // 組合 context 值
  const value: IChatContextType = {
    messages,
    users,
    currentUser,
    bot,
    isLoading,
    sendMessage,
    joinChat,
    leaveChat,
    clearMessages
  }
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

/**
 * useChat Hook
 * 用於在元件中使用 ChatContext
 * 提供型別安全和錯誤提示
 */
export function useChat() {
  const context = useContext(ChatContext)

  if (context === undefined) {
    throw new Error("useChat 必須在 ChatProvider 內使用")
  }

  return context
}