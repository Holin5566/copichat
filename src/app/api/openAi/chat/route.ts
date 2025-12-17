import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * OpenAI 聊天機器人 API
 * POST /api/openAi/chat
 * 
 * 請求體：
 * {
 *   "message": "Hello, how are you?"
 * }
 */
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "缺少 'message' 參數" }, { status: 400 });
        }

        // 調用 OpenAI API
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: message,
                },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const assistantMessage = response.choices[0].message.content;

        return NextResponse.json({
            success: true,
            message: message,
            response: assistantMessage,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}