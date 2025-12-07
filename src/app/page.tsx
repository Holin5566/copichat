"use client"

import { ChatStats } from "@/components/ChatStats"
import { Header } from "@/components/Header"
import { MessageInput } from "@/components/MessageInput"
import { MessageList } from "@/components/MessageList"
import { UserList } from "@/components/UserList"
import { AuthProvider } from "@/context/AuthContext"
import { ChatProvider } from "@/context/ChatContext"

/**
 * 聊天室主頁面
 *
 * 功能架構：
 * 1. ChatProvider：全應用狀態管理（透過 useContext 實現）
 * 2. UserLogin：使用者登入/登出
 * 3. ChatStats：聊天統計面板
 * 4. MessageList：訊息顯示區域
 * 5. MessageInput：訊息輸入框
 * 6. UserList：線上使用者列表
 *
 * 所有子元件透過 useChat hook 連接到 ChatContext
 * 實現數據流和狀態共享
 */
export default function ChatPage() {
  return (
    <ChatProvider>
      <AuthProvider>
        <div className="flex h-screen flex-col">
          {/* 使用者登入區域 */}
          <Header />

          {/* 統計面板 */}
          <ChatStats />

          {/* 主聊天區域 */}
          <div className="flex flex-1 overflow-hidden">
            {/* 訊息區域（左側） */}
            <div className="flex-1 flex flex-col">
              {/* 訊息列表 */}
              <MessageList />

              {/* 訊息輸入框 */}
              <MessageInput />
            </div>

            {/* 使用者列表（右側邊欄） */}
            <UserList />
          </div>
        </div>
      </AuthProvider>
    </ChatProvider>
  )
}
