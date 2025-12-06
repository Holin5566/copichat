"use client"

import { useChat } from "@/context/ChatContext"

/**
 * 聊天統計面板元件
 * 功能：
 * - 顯示統計信息卡片
 * - 訊息總數
 * - 線上使用者數
 * - 聊天室狀態
 */
export function ChatStats() {
  // 從 ChatContext 中取得統計數據
  const { messages, users, currentUser } = useChat()

  // 計算系統訊息數量
  const systemMessagesCount = messages.filter((msg) => msg.userId === "system").length

  // 計算使用者訊息數量
  const userMessagesCount = messages.length - systemMessagesCount

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      {/* 訊息統計卡片 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <p className="text-xs text-gray-600 mb-1">訊息統計</p>
        <p className="text-2xl font-bold text-blue-600">{userMessagesCount}</p>
        <p className="text-xs text-gray-500 mt-1">條聊天訊息</p>
      </div>

      {/* 線上使用者卡片 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <p className="text-xs text-gray-600 mb-1">線上人數</p>
        <p className="text-2xl font-bold text-green-600">{users.length}</p>
        <p className="text-xs text-gray-500 mt-1">位使用者在線</p>
      </div>

      {/* 聊天室狀態卡片 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <p className="text-xs text-gray-600 mb-1">聊天室狀態</p>
        <p className="text-2xl font-bold text-purple-600">{currentUser ? "活躍" : "待機"}</p>
        <p className="text-xs text-gray-500 mt-1">{currentUser ? "您已加入" : "未加入"}</p>
      </div>
    </div>
  )
}
