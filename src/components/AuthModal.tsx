"use client"

import React, { useState } from "react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "none" | "login" | "signup" | "guest"
  onSubmit: (data: { username?: string; email?: string; password?: string; guestName?: string }) => void
}

/**
 * 認證彈窗元件
 * 可用於登入、註冊和遊客登入
 */
export function AuthModal({ isOpen, onClose, mode, onSubmit }: AuthModalProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [guestName, setGuestName] = useState("")

  if (!isOpen) return null

  const handleSubmit = () => {
    if (mode === "guest") {
      if (!guestName.trim()) {
        alert("請輸入名稱")
        return
      }
      onSubmit({ guestName })
    } else if (mode === "login") {
      if (!username.trim() || !password.trim()) {
        alert("請輸入帳號和密碼")
        return
      }
      onSubmit({ username, password })
    } else if (mode === "signup") {
      if (!username.trim() || !email.trim() || !password.trim()) {
        alert("請填寫所有欄位")
        return
      }
      onSubmit({ username, email, password })
    }
    setEmail("")
    setPassword("")
    setUsername("")
    setGuestName("")
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "guest":
        return "遊客登入"
      case "login":
        return "登入"
      case "signup":
        return "註冊"
    }
  }

  const getButtonColor = () => {
    switch (mode) {
      case "guest":
        return "bg-gray-500 hover:bg-gray-600"
      case "login":
        return "bg-green-500 hover:bg-green-600"
      case "signup":
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const getRingColor = () => {
    switch (mode) {
      case "guest":
        return "focus:ring-gray-500"
      case "login":
        return "focus:ring-green-500"
      case "signup":
        return "focus:ring-blue-500"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4">{getTitle()}</h2>

        {mode === "guest" ? (
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="輸入名稱"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getRingColor()} mb-4`}
            autoFocus
          />
        ) : (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="帳號"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getRingColor()} mb-3`}
              autoFocus
            />
            {mode === "signup" && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="信箱"
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getRingColor()} mb-3`}
              />
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="密碼"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${getRingColor()} mb-4`}
            />
          </>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${getButtonColor()}`}
          >
            確認
          </button>
        </div>
      </div>
    </div>
  )
}
