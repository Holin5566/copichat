"use client"

import { useChat } from "@/context/ChatContext"
import { useState } from "react"

/**
 * 使用者登入元件
 * 功能：
 * - 輸入使用者名稱
 * - 加入聊天室
 * - 顯示當前使用者信息
 * - 離開聊天室功能
 */
export function UserLogin() {
  // 本地狀態：暫存輸入的使用者名稱
  const [userName, setUserName] = useState("")

  // 從 ChatContext 中取得相關方法和狀態
  const { joinChat, leaveChat, currentUser } = useChat()

  /**
   * 處理加入聊天室
   * - 驗證使用者名稱
   * - 呼叫 joinChat 方法
   * - 清空輸入框
   */
  const handleJoin = () => {
    if (!userName.trim()) {
      alert("請輸入使用者名稱")
      return
    }

    joinChat(userName)
    setUserName("")
  }

  /**
   * 處理離開聊天室
   * 呼叫 leaveChat 方法
   */
  const handleLeave = () => {
    leaveChat()
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {!currentUser ? (
        /* 未登入狀態：顯示登入表單 */
        <div className="flex gap-2">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleJoin()
              }
            }}
            placeholder="輸入使用者名稱"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleJoin}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            加入
          </button>
        </div>
      ) : (
        /* 已登入狀態：顯示使用者信息和離開按鈕 */
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentUser.avatar && (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
            )}
            <div>
              <p className="font-semibold text-gray-800">{currentUser.name}</p>
              <p className="text-xs text-gray-500">已加入聊天室</p>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            離開
          </button>
        </div>
      )}
    </div>
  )
}
