"use client"

import { useChat } from "@/context/ChatContext"
import React, { useState } from "react"

/**
 * 聊天輸入框元件
 * 功能：
 * - 接收使用者輸入
 * - 驗證訊息內容
 * - 透過 useChat hook 發送訊息
 * - 自動清空輸入框
 */
export function MessageInput() {
  // 本地狀態：暫存輸入的訊息內容
  const [inputValue, setInputValue] = useState("")

  // 從 ChatContext 中取得 sendMessage 方法和當前使用者
  const { sendMessage, currentUser } = useChat()

  /**
   * 處理發送訊息
   * - 驗證使用者是否已登入
   * - 驗證訊息是否為空
   * - 呼叫 sendMessage 發送訊息
   * - 清空輸入框
   */
  const handleSend = () => {
    // 檢查使用者是否已登入
    if (!currentUser) {
      alert("請先加入聊天室")
      return
    }

    // 檢查訊息是否為空
    if (!inputValue.trim()) {
      alert("訊息不能為空")
      return
    }

    // 發送訊息
    sendMessage(inputValue)

    // 清空輸入框
    setInputValue("")
  }

  /**
   * 處理按下 Enter 鍵
   * 快捷發送訊息功能
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2 p-4 bg-white border-t border-gray-200">
      {/* 輸入框 */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="輸入訊息... (按 Enter 發送)"
        disabled={!currentUser}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      {/* 發送按鈕 */}
      <button
        onClick={handleSend}
        disabled={!currentUser || !inputValue.trim()}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        發送
      </button>
    </div>
  )
}
