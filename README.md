# Next.js 聊天室專案 | Chat Application

TypeScript + Next.js + Tailwind CSS 構建的實時聊天應用。

## 📋 專案特色

### TODO
- **多模式認證系統** - 支援遊客登入、帳號登入、註冊功能
- **實時聊天系統** - 支持多使用者同時在線聊天
- **使用者管理** - 加入/離開聊天室，顯示線上人數
- **訊息歷史** - 保存所有聊天訊息和系統事件
- **使用者頭像** - 動態生成使用者頭像
- **聊天統計** - 實時顯示訊息數和使用者統計

### 技術重點
- **Context 架構** - 透過 useContext 分離關注點
- **React Context API** - 全應用狀態管理（useContext + useCallback）
- **TypeScript** - 完整的類型定義和 IDE 支持
- **Tailwind CSS** - 現代化的 UI 設計
- **Next.js App Router** - 最新的 Next.js 架構

## 🏗️ 專案結構

```
src/
├── app/
│   ├── page.tsx              # 主頁面，組裝所有元件
│   └── layout.tsx            # 根布局，整合雙 Context
├── context/
│   ├── AuthContext.tsx       # 認證狀態管理
│   └── ChatContext.tsx       # 聊天狀態管理
└── components/
    ├── AuthModal.tsx         # 認證彈窗（遊客/登入/註冊）
    ├── UserLogin.tsx         # 使用者登入/登出介面
    ├── MessageList.tsx       # 訊息列表顯示
    ├── MessageInput.tsx      # 訊息輸入框
    ├── UserList.tsx          # 線上使用者列表
    └── ChatStats.tsx         # 聊天統計面板
```