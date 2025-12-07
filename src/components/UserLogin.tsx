"use client"

import { useChat } from "@/context/ChatContext"
import { useState } from "react"
import { AuthModal } from "./AuthModal"

/**
 * 使用者登入元件
 * 功能：
 * - 遊客登入
 * - 帳號密碼登入
 * - 顯示當前使用者信息
 * - 離開聊天室功能
 */
export function UserLogin() {
  //TODO - login
  // handle login
  // handle signup
  // handle logout
  // handle guest login

  // 本地狀態
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // 從 ChatContext 中取得相關方法和狀態
  const { joinChat, leaveChat, currentUser } = useChat()

  /**
   * 處理遊客登入
   */
  const handleGuestLogin = (data: { guestName?: string }) => {
    if (data.guestName) {
      joinChat(data.guestName)
    }
  }

  /**
   * 處理帳號密碼登入
   */
  const handleLogin = (data: { username?: string; password?: string }) => {
    if (data.username) {
      // TODO: 接入實際的登入 API
      joinChat(data.username)
    }
  }

  /**
   * 處理離開聊天室
   */
  const handleLeave = () => {
    leaveChat()
  }

  //TODO
  // 1.預設遊客登入
  // 2.登入按鈕 + 展開選單
  // 3.註冊按鈕 + 展開選單
  // 4.登入後顯示使用者資訊 + 登出按鈕
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {!currentUser ? (
        /* 未登入狀態：顯示兩個按鈕 */
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowGuestModal(true)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            遊客登入
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            登入
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

      {/* 遊客登入彈窗 */}
      <AuthModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        mode="guest"
        onSubmit={handleGuestLogin}
      />

      {/* 登入彈窗 */}
      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} mode="login" onSubmit={handleLogin} />
    </div>
  )
}
