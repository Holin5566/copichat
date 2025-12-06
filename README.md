# Next.js 聊天室專案 | Chat Application

TypeScript + Next.js + Tailwind CSS 構建的實時聊天應用，適合面試作品展示。

## 📋 專案特色

### 核心功能
- ✅ **實時聊天系統** - 支持多使用者同時在線聊天
- ✅ **使用者管理** - 加入/離開聊天室，顯示線上人數
- ✅ **訊息歷史** - 保存所有聊天訊息和系統事件
- ✅ **使用者頭像** - 動態生成使用者頭像
- ✅ **聊天統計** - 實時顯示訊息數和使用者統計

### 技術亮點
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
│   └── layout.tsx            # 根布局
├── context/
│   └── ChatContext.tsx       # 聊天狀態管理（useContext）
└── components/
    ├── UserLogin.tsx         # 使用者登入/登出
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

```
ChatContext (useContext)
    ↓
    ├── messages: Message[]          # 聊天訊息
    ├── users: User[]                # 線上使用者
    ├── currentUser: User | null     # 當前登入使用者
    └── 方法:
        ├── sendMessage()     # 發送訊息
        ├── joinChat()        # 加入聊天室
        ├── leaveChat()       # 離開聊天室
        └── clearMessages()   # 清空訊息
```

所有子元件透過 `useChat` hook 連接到 ChatContext，實現組件間的數據共享和事件通信。

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

### 1. Context API 狀態管理
```typescript
// ChatContext.tsx
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // 狀態定義
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // 方法定義
  const sendMessage = useCallback((content: string) => {
    // 業務邏輯...
  }, [currentUser]);
  
  return <ChatContext.Provider value={...}>{children}</ChatContext.Provider>;
}

// 使用 Hook
export function useChat() {
  const context = useContext(ChatContext);
  return context; // 類型安全
}
```

### 2. 元件通信
- **父 → 子**: Props 傳遞
- **跨層級**: useChat hook 從 ChatContext 取得數據
- **事件**: onClick → 方法 → 更新 context 狀態 → 自動重新渲染

### 3. 代碼示例

**登入元件**
```typescript
export function UserLogin() {
  const { joinChat, currentUser } = useChat(); // 取得 context 數據
  
  const handleJoin = () => {
    joinChat(userName); // 呼叫 context 方法，自動更新狀態
  };
}
```

**訊息輸入**
```typescript
export function MessageInput() {
  const { sendMessage, currentUser } = useChat();
  
  const handleSend = () => {
    sendMessage(inputValue); // 更新 messages 狀態
  };
}
```

**訊息顯示**
```typescript
export function MessageList() {
  const { messages } = useChat(); // 自動獲取最新訊息
  
  // messages 變化 → 自動重新渲染
  return <div>{messages.map(...)}</div>;
}
```

## ✨ 功能詳解

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

## 🎯 面試亮點

1. **完整的狀態管理** - 展示對 React Context 的深入理解
2. **TypeScript 類型系統** - 完整的介面定義和型別檢查
3. **Clean Code 實踐** - 代碼組織清晰，註解完善
4. **React Hooks** - useContext、useState、useCallback、useEffect 的正確使用
5. **UI/UX 設計** - 響應式布局，用戶友好的交互設計
6. **性能優化** - useCallback 避免不必要的重新渲染
7. **錯誤處理** - 合理的邊界條件檢查和用戶提示

## 📝 常見問題

### Q: 為什麼使用 Context API 而不是 Redux？
A: Context API 足以滿足此應用的狀態管理需求，避免過度設計。對於面試展示，展示對基礎 API 的深入理解更重要。

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
