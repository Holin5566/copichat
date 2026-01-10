/**
 * WebSocket 伺服器
 * 使用 Socket.io 管理實時通訊
 * 
 * 運行方式：node server/websocket.js
 */

require('dotenv').config({ path: '.env.local' }); // 載入環境變數
const http = require('http');
const { Server } = require('socket.io');
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

        openaiService.chat(`${message.userName}:${message.content}`).then((response) => {
            if (response.success && response.response) {
                const aiMessage = {
                    id: `${Date.now()}-${Math.random()}`,
                    userId: 'ai-bot',
                    userName: 'AI Assistant',
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai',
                    content: response.response,
                    timestamp: new Date(),
                    type: 'message',
                };
                messageHistory.push(aiMessage);
                if (messageHistory.length > 100) messageHistory.shift();
                io.emit('chat:message', aiMessage);
            }
        }).catch(err => {
            console.error('AI Error:', err);
        });
        // 添加到歷史
        messageHistory.push(message);

        // 保持歷史限制在 100 條訊息
        if (messageHistory.length > 100) {
            messageHistory.shift();
        }

        // 廣播訊息給所有連接的客戶端
        io.emit('chat:message', message);

        console.log(`[訊息] ${user.userName}: ${data.content}`);
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
