/**
 * WebSocket 伺服器
 * 使用 Socket.io 管理實時通訊
 * 
 * 運行方式：node server/websocket.js
 */

const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const envConfig = require('dotenv');
console.log(`[環境] 載入設定檔: ${path.resolve(__dirname, '.env')}`);
envConfig.config({ path: path.resolve(__dirname, '.env') });

const { openaiService } = require('./services/openai.service.js');

// 建立 HTTP 伺服器
const server = http.createServer();

// 建立 Socket.io 實例，允許 CORS
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// 儲存連接的用戶
const users = new Map();
const aiBot = {
    id: `ai-bot`,
    userName: "AI助手",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=AI`,
    joinedAt: new Date(),
};
users.set(aiBot.id, aiBot)
// 訊息歷史
const messageHistory = [];

// Socket.io 事件監聽
io.on('connection', (socket) => {
    console.log(`[連接] 新用戶連接: ${socket.id}`);

    // 用戶加入聊天室
    socket.on('user:join', (data) => {
        const { userName } = data;

        users.set(socket.id, {
            id: socket.id,
            userName,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
            joinedAt: new Date(),
        });

        // 通知所有客戶端有新用戶加入
        io.emit('user:joined', {
            user: users.get(socket.id),
            users: Array.from(users.values()),
            totalUsers: users.size,
        });

        // 發送訊息歷史給新連接的客戶端
        socket.emit('chat:history', messageHistory);

        console.log(`[加入] ${userName} 加入了聊天室 (總用戶: ${users.size})`);
    });

    // 接收聊天訊息
    socket.on('chat:message', (data) => {
        const user = users.get(socket.id);

        if (!user) {
            socket.emit('error', { message: '用戶未加入聊天室' });
            return;
        }

        const message = {
            id: `${Date.now()}-${Math.random()}`,
            userId: socket.id,
            userName: user.userName,
            avatar: user.avatar,
            content: data.content,
            timestamp: new Date(),
            type: 'message',
        };

        // 廣播訊息給所有連接的客戶端
        io.emit('chat:message', message);

        console.log(`[訊息] ${user.userName}: ${data.content}`);

        // 準備聊天歷史紀錄 (轉換為 OpenAI 格式)
        const chatHistory = messageHistory.slice(-10).map(msg => ({
            role: msg.userId === 'ai-bot' ? 'assistant' : 'user',
            content: msg.userId === 'ai-bot' ? msg.content : `${msg.userName}: ${msg.content}`
        }));

        openaiService.chat(data.content, chatHistory).then((response) => {
            if (response.success && response.response) {
                const aiBot = users.get(`ai-bot`)
                const aiMessage = {
                    id: `${Date.now()}-${Math.random()}`,
                    userId: aiBot.id,
                    userName: aiBot.userName,
                    avatar: aiBot.avatar,
                    content: response.response,
                    timestamp: new Date(),
                    type: 'message',
                };
                console.log(`[訊息] ${aiBot.userName}: ${response.response}`);
                messageHistory.push(aiMessage);
                if (messageHistory.length > 100) messageHistory.shift();
                io.emit('chat:message', aiMessage);
            }
        }).catch(err => {
            // 忽略錯誤，不要讓 AI 失敗影響到 WebSocket Server
            console.error('AI Error:', err);
        });
    });

    // 用戶離開
    socket.on('user:leave', () => {
        const user = users.get(socket.id);

        if (user) {
            users.delete(socket.id);

            // 通知所有客戶端
            io.emit('user:left', {
                user,
                users: Array.from(users.values()),
                totalUsers: users.size,
            });

            console.log(`[離開] ${user.userName} 離開了聊天室 (總用戶: ${users.size})`);
        }
    });

    // 斷開連接
    socket.on('disconnect', () => {
        const user = users.get(socket.id);

        if (user) {
            users.delete(socket.id);

            io.emit('user:left', {
                user,
                users: Array.from(users.values()),
                totalUsers: users.size,
            });

            console.log(
                `[斷開] ${user.userName} 已斷開連接 (總用戶: ${users.size})`
            );
        } else {
            console.log(`[斷開] 未知用戶斷開連接: ${socket.id}`);
        }
    });

    // 錯誤處理
    socket.on('error', (error) => {
        console.error(`[錯誤] Socket ${socket.id} 錯誤:`, error);
    });
});

// 啟動伺服器
const PORT = 3001;

server.listen(PORT, () => {
    console.log(`\n🚀 WebSocket 伺服器已啟動`);
    console.log(`📍 地址: http://localhost:${PORT}`);
    console.log(`🔗 WS 連接: ws://localhost:${PORT}`);
    console.log(`\n等待客戶端連接...\n`);
});
