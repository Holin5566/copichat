/**
 * useSocket Hook
 * 管理 Socket.io 連接和事件
 * 
 * 使用方式：
 * const { isConnected, sendMessage, users } = useSocket()
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketUser {
    id: string;
    userName: string;
    avatar: string;
    joinedAt: Date;
}

interface SocketMessage {
    id: string;
    userId: string;
    userName: string;
    avatar: string;
    content: string;
    timestamp: Date;
    type: string;
}

interface UseSocketOptions {
    url?: string;
    autoConnect?: boolean;
}

/**
 * Socket.io Hook
 * @param options 配置選項
 * @returns Socket 相關的狀態和方法
 */
export function useSocket(
    options: UseSocketOptions = { autoConnect: true }
) {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [users, setUsers] = useState<SocketUser[]>([]);
    const [messages, setMessages] = useState<SocketMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 初始化 Socket 連接
    useEffect(() => {
        if (!options.autoConnect) return;

        const wsUrl = options.url || process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';

        console.log('[Socket] 正在連接到:', wsUrl);

        // 建立連接
        const socket = io(wsUrl, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 10,
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        // 連接成功
        socket.on('connect', () => {
            console.log('[Socket] 連接成功:', socket.id);
            setIsConnected(true);
            setError(null);
        });

        // 接收用戶加入事件
        socket.on('user:joined', (data: { user: SocketUser; users: SocketUser[]; }) => {
            console.log('[Socket] 用戶加入:', data.user.userName);
            setUsers(data.users);
        });

        // 接收聊天訊息
        socket.on('chat:message', (message: SocketMessage) => {
            console.log('[Socket] 收到訊息:', message);
            setMessages((prev) => [...prev, message]);
        });

        // 接收訊息歷史
        socket.on('chat:history', (history: SocketMessage[]) => {
            console.log('[Socket] 收到訊息歷史:', history.length, '條訊息');
            setMessages(history);
        });

        // 用戶離開
        socket.on('user:left', (data: { user: SocketUser; users: SocketUser[]; }) => {
            console.log('[Socket] 用戶離開:', data.user.userName);
            setUsers(data.users);
        });

        // 錯誤
        socket.on('error', (errorData: { message: string; }) => {
            console.error('[Socket] 錯誤:', errorData.message);
            setError(errorData.message);
        });

        // 斷開連接
        socket.on('disconnect', () => {
            console.log('[Socket] 已斷開連接');
            setIsConnected(false);
        });

        // 連接失敗
        socket.on('connect_error', (error: Error) => {
            console.error('[Socket] 連接失敗:', error.message);
            setError(`連接失敗: ${error.message}`);
        });

        // 清理函數
        return () => {
            console.log('[Socket] 清理連接');
            socket.disconnect();
            socketRef.current = null;
        };
    }, [options.autoConnect, options.url]);

    // 發送訊息
    const sendMessage = (content: string) => {
        if (!socketRef.current?.connected) {
            setError('未連接到伺服器');
            return;
        }

        if (!content.trim()) {
            setError('訊息不能為空');
            return;
        }

        socketRef.current.emit('chat:message', { content: content.trim() });
    };

    // 加入聊天室
    const joinChat = (userName: string) => {
        if (!socketRef.current?.connected) {
            setError('未連接到伺服器');
            return;
        }

        socketRef.current.emit('user:join', { userName });
    };

    // 離開聊天室
    const leaveChat = () => {
        if (!socketRef.current?.connected) return;
        socketRef.current.emit('user:leave');
    };

    // 手動連接
    const connect = () => {
        if (socketRef.current) {
            socketRef.current.connect();
        }
    };

    // 手動斷開
    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };

    return {
        isConnected,
        users,
        messages,
        isTyping,
        error,
        sendMessage,
        joinChat,
        leaveChat,
        connect,
        disconnect,
        socket: socketRef.current,
    };
}
