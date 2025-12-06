"use client"

import { useChat } from "@/context/ChatContext"

/**
 * 線上使用者清單元件
 * 功能：
 * - 顯示所有線上的使用者
 * - 顯示使用者頭像和名稱
 * - 顯示線上人數統計
 * - 使用者加入/離開時實時更新
 */
export function UserList() {
  // 從 ChatContext 中取得線上使用者列表
  const { users } = useChat()

  return (
    <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
      {/* 側邊欄標題 */}
      <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-4">
        <h2 className="font-semibold text-gray-800">線上使用者 ({users.length})</h2>
      </div>

      {/* 使用者列表 */}
      <div className="p-4 space-y-2">
        {users.length === 0 ? (
          /* 空狀態：沒有使用者時 */
          <p className="text-sm text-gray-400 text-center py-4">暫無使用者在線</p>
        ) : (
          /* 使用者列表 */
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* 使用者頭像 */}
              {user.avatar && <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />}

              {/* 使用者名稱容器 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-400">
                  {/* 顯示加入時間 */}
                  {new Date(user.joinedAt).toLocaleTimeString("zh-TW", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

              {/* 線上狀態指示器 */}
              <div className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
