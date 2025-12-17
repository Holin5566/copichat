/**
 * 用戶註冊 API
 * POST /api/auth/signup
 * 
 * 請求體：
 * {
 *   "userName": "newuser",
 *   "email": "new@example.com",
 *   "password": "password123"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';

interface SignupRequest {
    userName: string;
    email: string;
    password: string;
}

// 簡單的用戶資料庫（實際應用應該用真實資料庫）
const registeredUsers: SignupRequest[] = [];

export async function POST(request: NextRequest) {
    try {
        const body: SignupRequest = await request.json();

        // 驗證輸入
        if (!body.userName || !body.email || !body.password) {
            return NextResponse.json(
                { error: '所有欄位都是必須的' },
                { status: 400 }
            );
        }

        if (body.userName.length < 3) {
            return NextResponse.json(
                { error: '使用者名稱至少需要 3 個字元' },
                { status: 400 }
            );
        }

        if (body.password.length < 6) {
            return NextResponse.json(
                { error: '密碼至少需要 6 個字元' },
                { status: 400 }
            );
        }

        // 驗證信箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: '信箱格式無效' },
                { status: 400 }
            );
        }

        // 檢查帳號是否已存在
        if (registeredUsers.some((u) => u.userName === body.userName)) {
            return NextResponse.json(
                { error: '使用者名稱已被使用' },
                { status: 409 }
            );
        }

        // 檢查信箱是否已存在
        if (registeredUsers.some((u) => u.email === body.email)) {
            return NextResponse.json(
                { error: '信箱已被使用' },
                { status: 409 }
            );
        }

        // 保存新用戶（注意：此為演示用，實際應保存到資料庫）
        registeredUsers.push(body);

        // 註冊成功
        return NextResponse.json(
            {
                success: true,
                user: {
                    userName: body.userName,
                    email: body.email,
                    id: `user-${Date.now()}`,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.userName}`
                },
                message: '註冊成功'
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: '伺服器錯誤' },
            { status: 500 }
        );
    }
}
