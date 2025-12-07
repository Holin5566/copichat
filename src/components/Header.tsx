"use client"

import { useAuth } from "@/context/AuthContext"
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
export function Header() {
  // 本地狀態
  const [authModal, setAuthModal] = useState<"none" | "login" | "signup" | "guest">("none")

  // 從 ChatContext 中取得相關方法和狀態
  const { leaveChat, joinChat } = useChat()
  const { profile, isAuthenticated, guestLogin, login, signup, logout } = useAuth()

  /**
   * 處理離開聊天室
   */
  const handleLeave = () => {
    leaveChat()
    logout()
  }

  const handleShowAuthModal = (mode: "login" | "signup" | "guest") => {
    setAuthModal(mode)
  }

  const handleCloseAuthModal = () => {
    setAuthModal("none")
  }

  const handleAuthSubmit = async (data: {
    username?: string
    email?: string
    password?: string
    guestName?: string
  }) => {
    switch (authModal) {
      case "guest":
        if (data.guestName) {
          await guestLogin(data.guestName)
          joinChat(data.guestName)
        }
        break
      case "login":
        if (data.username && data.password) {
          await login(data.username, data.password)
          joinChat(data.username)
        }
        break
      case "signup":
        if (data.username && data.email && data.password) {
          await signup(data.username, data.email, data.password)
          joinChat(data.username)
        }
        break
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {!isAuthenticated ? (
        /* 未登入狀態：顯示兩個按鈕 */
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleShowAuthModal("guest")}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            遊客登入
          </button>
          <button
            onClick={() => handleShowAuthModal("login")}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            登入
          </button>
          <button
            onClick={() => handleShowAuthModal("signup")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            註冊
          </button>
        </div>
      ) : (
        /* 已登入狀態：顯示使用者信息和離開按鈕 */
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile.avatarUrl && (
              <img src={profile.avatarUrl} alt={profile.userName} className="w-10 h-10 rounded-full" />
            )}
            <div>
              <p className="font-semibold text-gray-800">{profile.userName}</p>
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

      {/* 登入彈窗 */}
      <AuthModal
        isOpen={authModal !== "none"}
        mode={authModal}
        onClose={handleCloseAuthModal}
        onSubmit={handleAuthSubmit}
      />
    </div>
  )
}
