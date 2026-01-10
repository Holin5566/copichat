const OpenAI = require('openai');

let openaiInstance = null;

function getOpenAI() {
    if (!openaiInstance) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY 未設定，請檢查 .env 檔案');
        }
        openaiInstance = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiInstance;
}

/**
 * OpenAI 服務
 */
const openaiService = {
    /**
     * 發送聊天訊息到 OpenAI
     * @param {string} userMessage 使用者最新訊息
     * @param {Array} history 歷史訊息
     * @returns {Promise} 成功回應或錯誤
     */
    async chat(userMessage, history = []) {
        try {
            // 獲取 OpenAI 實例 (延遲初始化)
            const openai = getOpenAI();

            // 驗證輸入
            if (!userMessage || typeof userMessage !== 'string') {
                return {
                    error: '訊息不能為空',
                };
            }

            // 1. 設定系統提示詞 (AI 的人設)
            const systemMessage = {
                role: 'system',
                content: '你是一個樂於助人的 AI 聊天助手。請用繁體中文回答。'
            };

            // 2. 組合最終訊息列表: 系統提示 -> 歷史紀錄 -> 最新訊息
            const messages = [
                systemMessage,
                ...history,
                { role: 'user', content: userMessage }
            ];

            // 調用 OpenAI API
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
            });

            const assistantMessage = response.choices[0].message.content;

            return {
                success: true,
                message: userMessage,
                response: assistantMessage,
            };

        } catch (error) {
            console.error('OpenAI Service Error:', error);
            return {
                error: `OpenAI API 錯誤: ${error.message}`,
            };
        }
    },
};

module.exports = { openaiService };
