/**
 * 用戶驗證 API
 * POST /api/auth/login
 * 
 * 請求體：
 * {
 *   "userName": "alice",
 *   "password": "123456"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';

interface LoginRequest {
    userName: string;
    password: string;
}

// 假資料：測試帳號
const MOCK_USERS = [
    { userName: 'alice', password: '123456', email: 'alice@example.com' },
    { userName: 'bob', password: '123456', email: 'bob@example.com' },
    { userName: 'charlie', password: '123456', email: 'charlie@example.com' }
];

export async function POST(request: NextRequest) {
    try {
        const body: LoginRequest = await request.json();

        // 驗證請求體
        if (!body.userName || !body.password) {
            return NextResponse.json(
                { error: '帳號和密碼不能為空' },
                { status: 400 }
            );
        }

        // 查找用戶
        const user = MOCK_USERS.find(
            (u) => u.userName === body.userName && u.password === body.password
        );

        if (!user) {
            return NextResponse.json(
                { error: '帳號或密碼錯誤' },
                { status: 401 }
            );
        }

        // 登入成功（實際應用應該返回 JWT token）
        return NextResponse.json(
            {
                success: true,
                user: {
                    userName: user.userName,
                    email: user.email,
                    id: `user-${user.userName}`,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`
                },
                message: '登入成功'
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: '伺服器錯誤' },
            { status: 500 }
        );
    }
}
