"use client"

import { useChat } from "@/context/ChatContext"
import { useEffect, useRef } from "react"

/**
 * 訊息列表元件
 * 功能：
 * - 顯示所有聊天訊息
 * - 訊息自動滾動到最新
 * - 區分系統訊息和使用者訊息
 * - 顯示訊息時間和使用者頭像
 */
export function MessageList() {
  // 從 ChatContext 中取得訊息列表
  const { messages, currentUser } = useChat()

  // 參考滾動容器的最底部
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * 自動滾動到最新訊息
   * - 在訊息更新時觸發
   * - 滾動到容器最底部
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /**
   * 格式化時間戳記
   * 顯示為 HH:mm 格式
   */
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {/* 空狀態：未有訊息時顯示 */}
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>還沒有訊息，開始聊天吧！</p>
        </div>
      )}

      {/* 訊息列表容器 */}
      <div className="space-y-4">
        {messages.map((message) => {
          // 判斷是否為系統訊息
          const isSystemMessage = message.userId === "system"
          // 判斷是否為當前使用者發送的訊息
          const isCurrentUser = currentUser?.id === message.userId

          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              {/* 系統訊息樣式 */}
              {isSystemMessage ? (
                <div className="w-full flex justify-center">
                  <p className="text-sm text-gray-500 text-center italic">{message.content}</p>
                </div>
              ) : (
                /* 使用者訊息樣式 */
                <div className={`flex gap-2 max-w-xs ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                  {/* 使用者頭像 */}
                  {message.avatar && (
                    <img src={message.avatar} alt={message.userName} className="w-8 h-8 rounded-full shrink-0" />
                  )}

                  {/* 訊息內容容器 */}
                  <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                    {/* 使用者名稱和時間 */}
                    <div className="flex gap-2 text-xs text-gray-600 mb-1">
                      <span>{message.userName}</span>
                      <span>{formatTime(message.timestamp)}</span>
                    </div>

                    {/* 訊息氣泡 */}
                    <div
                      className={`px-4 py-2 rounded-lg break-words ${
                        isCurrentUser
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* 自動滾動參考點 */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
