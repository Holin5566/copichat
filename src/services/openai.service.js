const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OpenAI 服務
 */
const openaiService = {
    /**
     * 發送聊天訊息到 OpenAI
     * @param {string} message 使用者訊息
     * @returns {Promise} 成功回應或錯誤
     */
    async chat(message) {
        try {
            // 驗證輸入
            if (!message || typeof message !== 'string') {
                return {
                    error: '訊息不能為空',
                };
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

            return {
                success: true,
                message: message,
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
