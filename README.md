# Next.js 聊天室專案 | Chat Application

TypeScript + Next.js + Tailwind CSS 構建的實時聊天應用。

## 📋 專案特色

### 核心功能
- ✅ **多模式認證系統** - 支援遊客登入、帳號登入、註冊功能
- ✅ **實時聊天系統** - 支持多使用者同時在線聊天
- ✅ **使用者管理** - 加入/離開聊天室，顯示線上人數
- ✅ **訊息歷史** - 保存所有聊天訊息和系統事件
- ✅ **使用者頭像** - 動態生成使用者頭像
- ✅ **聊天統計** - 實時顯示訊息數和使用者統計

### 技術亮點
- **雙 Context 架構** - AuthContext + ChatContext 分離關注點
- **模組化認證系統** - AuthModal 支援多種登入模式
- **React Context API** - 全應用狀態管理（useContext + useCallback）
- **TypeScript** - 完整的類型定義和 IDE 支持
- **Tailwind CSS** - 現代化的 UI 設計
- **Next.js App Router** - 最新的 Next.js 架構
- **Clean Code** - 完整的代碼註解和結構化設計

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

## 🔧 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.x | React 框架 |
| React | 19.x | UI 庫 |
| TypeScript | 5.x | 類型系統 |
| Tailwind CSS | 4.x | 樣式框架 |
| ESLint | 9.x | 代碼規範 |

## 📦 數據流設計

### 雙 Context 架構

```
AuthContext (認證狀態)
    ↓
    ├── profile: UserProfile         # 使用者資料
    ├── isAuthenticated: boolean     # 認證狀態
    ├── role: Role                   # 使用者角色
    └── 方法:
        ├── login()           # 帳號登入
        ├── signup()          # 註冊
        ├── guestLogin()      # 遊客登入
        └── logout()          # 登出

ChatContext (聊天狀態)
    ↓
    ├── messages: Message[]          # 聊天訊息
    ├── users: User[]                # 線上使用者
    ├── currentUser: User | null     # 當前聊天使用者
    └── 方法:
        ├── sendMessage()     # 發送訊息
        ├── joinChat()        # 加入聊天室
        ├── leaveChat()       # 離開聊天室
        └── clearMessages()   # 清空訊息
```

所有子元件透過 `useAuth` 和 `useChat` hooks 連接到對應的 Context，實現關注點分離和組件間的數據共享。

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 生產構建
```bash
npm run build
npm start
```

## 💡 核心設計概念

### 1. 雙 Context 架構
分離認證與聊天邏輯，提高可維護性和可測試性：

```typescript
// AuthContext.tsx - 處理認證邏輯
export function AuthProvider({ children }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = useCallback(async (username, password) => {
    // 登入邏輯
  }, []);
  
  const guestLogin = useCallback(async (name) => {
    // 遊客登入邏輯
  }, []);
  
  return <AuthContext.Provider value={...}>{children}</AuthContext.Provider>;
}

// ChatContext.tsx - 處理聊天邏輯
export function ChatProvider({ children }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const sendMessage = useCallback((content: string) => {
    // 聊天邏輯
  }, [currentUser]);
  
  return <ChatContext.Provider value={...}>{children}</ChatContext.Provider>;
}
```

### 2. 模組化認證系統
使用單一 AuthModal 元件支援多種認證模式：

```typescript
// AuthModal.tsx - 統一的認證彈窗
<AuthModal 
  mode="login" | "signup" | "guest"  // 三種模式
  onSubmit={handleAuthSubmit}        // 父元件處理邏輯
  onClose={handleClose}
/>
```

### 3. 元件通信模式
- **認證流程**: AuthModal → Header (UserLogin) → AuthContext
- **聊天流程**: MessageInput → ChatContext → MessageList
- **跨 Context**: useAuth() + useChat() 協同工作

### 4. 代碼示例

**認證元件**
```typescript
export function Header() {
  const { login, signup, guestLogin } = useAuth();
  const { joinChat } = useChat();
  
  const handleAuthSubmit = async (data) => {
    // 先進行認證
    await login(data.username, data.password);
    // 再加入聊天室
    joinChat(data.username);
  };
}
```

**聊天元件**
```typescript
export function MessageInput() {
  const { sendMessage } = useChat();
  const { isAuthenticated } = useAuth();
  
  const handleSend = () => {
    if (isAuthenticated) {
      sendMessage(inputValue);
    }
  };
}
```

## ✨ 功能詳解

### 認證系統
- **遊客登入** - 快速進入聊天室，僅需輸入名稱
- **帳號登入** - 使用帳號密碼登入
- **註冊功能** - 建立新帳號，包含信箱驗證欄位
- **統一 Modal** - 單一彈窗支援三種模式，減少程式碼重複

### 訊息系統
- 實時訊息發送和接收
- 自動時間戳記
- 系統訊息（使用者加入/離開）
- 訊息自動滾動到最新

### 使用者管理
- 加入聊天室創建使用者
- 動態頭像生成（DiceBear API）
- 線上人數實時更新
- 優雅的離開提示

### 統計面板
- 訊息總數統計
- 線上人數計算
- 聊天室狀態顯示

## 📝 常見問題

### Q: 為什麼使用 Context API 而不是 Redux？
A: Context API 足以滿足此應用的狀態管理需求，避免過度設計。

### Q: 如何擴展為持久化存儲？
A: 可以使用 localStorage 或集成數據庫 API，在 useEffect 中同步狀態。

### Q: 如何實現實時同步多終端？
A: 集成 WebSocket 或 Supabase realtime 進行實時數據同步。

## 📄 許可證

MIT


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
