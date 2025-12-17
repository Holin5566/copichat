/**
 * 取得線上用戶列表 API
 * GET /api/users
 * 
 * 返回當前線上的所有用戶
 */

import { NextResponse } from 'next/server';

// 模擬在線用戶列表
const ONLINE_USERS = [
    {
        id: 'user-001',
        userName: 'alice',
        email: 'alice@example.com',
        status: 'online',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
    },
    {
        id: 'user-002',
        userName: 'bob',
        email: 'bob@example.com',
        status: 'online',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
    },
    {
        id: 'guest-123',
        userName: 'Guest User',
        email: null,
        status: 'online',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
    }
];

export async function GET() {
    return NextResponse.json(
        {
            success: true,
            users: ONLINE_USERS,
            count: ONLINE_USERS.length
        },
        { status: 200 }
    );
}
