/**
 * OpenAI Service Layer
 * 
 * 封裝所有 OpenAI API 調用邏輯
 * 提供型別安全的方法
 */

interface OpenAiResponse {
    success: true;
    message: string;
    response: string;
}

interface OpenAiError {
    success?: false;
    error: string;
}

type OpenAiResult = OpenAiResponse | OpenAiError;

/**
 * 檢查回應是否為成功
 */
function isOpenAiResponse(data: unknown): data is OpenAiResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'success' in data &&
        data.success === true &&
        'response' in data &&
        typeof (data as OpenAiResponse).response === 'string'
    );
}

/**
 * 檢查回應是否為錯誤
 */
function isOpenAiError(data: unknown): data is OpenAiError {
    return (
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof (data as OpenAiError).error === 'string'
    );
}

/**
 * OpenAI 服務
 */
export const openaiService = {
    /**
     * 發送聊天訊息到 OpenAI
     * @param message 使用者訊息
     * @returns Promise<OpenAiResult> 成功回應或錯誤
     */
    async chat(message: string): Promise<OpenAiResult> {
        try {
            // 驗證輸入
            if (!message || typeof message !== 'string') {
                return {
                    error: '訊息不能為空',
                };
            }

            // 調用 API
            const response = await fetch('/api/openAi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message.trim() }),
            });

            // 解析回應
            const data = (await response.json()) as unknown;

            // 檢查 HTTP 狀態
            if (!response.ok) {
                if (isOpenAiError(data)) {
                    return {
                        error: data.error,
                    };
                }
                return {
                    error: `伺服器錯誤 (${response.status})`,
                };
            }

            // 檢查回應格式
            if (isOpenAiResponse(data)) {
                return data;
            }

            return {
                error: 'OpenAI 回應格式無效',
            };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : '未知錯誤';
            console.error('OpenAI Service Error:', errorMessage);
            return {
                error: `連線失敗: ${errorMessage}`,
            };
        }
    },
};
