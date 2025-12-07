"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

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

  // 載入狀態
  const [isLoading, setIsLoading] = useState(false)

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

      // 建立新訊息物件
      const newMessage: IMessage = {
        id: `${Date.now()}-${Math.random()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        content: content.trim(),
        timestamp: new Date(),
        avatar: currentUser.avatar
      }

      // 更新訊息列表
      setMessages((prev) => [...prev, newMessage])
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
    // 添加到線上使用者列表
    setUsers((prev) => [...prev, newUser])

    // 發送系統訊息
    const systemMessage: IMessage = {
      id: `sys-${Date.now()}`,
      userId: "system",
      userName: "系統",
      content: `${userName} 加入了聊天室`,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, systemMessage])
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

    // 從線上使用者列表移除
    setUsers((prev) => prev.filter((user) => user.id !== currentUser.id))

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

  // 組合 context 值
  const value: IChatContextType = {
    messages,
    users,
    currentUser,
    isLoading,
    sendMessage,
    joinChat,
    leaveChat,
    clearMessages
  }

  useEffect(() => {
    mockChatResponder(
      joinChat,
      (botMessage: IMessage) => setMessages((prev) => [...prev, botMessage]))
    }, [])
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

function mockChatResponder(joinChat:(userName: string) => void, onMessage: (message: IMessage) => void) {
  const botResponses = [
    "今天過得怎麼樣？",
    "你喜歡聊天嗎？",
    "告訴我一個笑話吧！",
    "你最喜歡的電影是什麼？",
    "你有什麼興趣愛好？",
    "你覺得人工智慧未來會怎麼發展？",
    "你喜歡旅行嗎？最想去的地方是哪裡？",
    "你平常喜歡聽什麼音樂？",
    "你有養寵物嗎？牠們是什麼品種？",
    "你最喜歡的食物是什麼？",
    "你有什麼特別的才能或技能嗎？",
    "你覺得人生的意義是什麼？",
    "你喜歡閱讀嗎？最近在看什麼書？",
    "你有沒有什麼夢想或目標？",
    "你覺得科技對生活的影響是正面還是負面？",
    "你喜歡運動嗎？最喜歡哪一種運動？",
    "你有沒有什麼有趣的旅行經歷可以分享？",
    "你覺得未來的世界會是什麼樣子？",
    "你喜歡哪一種天氣？晴天還是雨天？",
    "你有沒有什麼特別的嗜好或收藏？",
  ]
  joinChat("聊天機器人");
  let preRandomIndex = 0;
  setInterval(() => {
    if (Math.random() < 0.3) return // 70% 機率不回應
    let randomIndex = Math.floor(Math.random() * botResponses.length)
    while (randomIndex === preRandomIndex) {
      randomIndex = Math.floor(Math.random() * botResponses.length)
    }
    const botMessage: IMessage = {
      id: `bot-${Date.now()}`,
      userId: "bot",
      userName: "聊天機器人",
      content: botResponses[randomIndex],
      timestamp: new Date()
    }
    onMessage(botMessage)
  }, 3000) // 每秒發送一次訊息
};