"use client";

class AiServiceClass {
    private _url = "http://localhost:5000";

    private get chatRoute() { return `${this._url}/chat`; }
    public async postChat(message: string): Promise<string> {
        const response = await fetch(this.chatRoute, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        console.error(data);
        return data.reply;
    }

    public async getHealth(): Promise<boolean> {
        const response = await fetch("http://localhost:5000/health");
        return response.ok;
    }
}

export const AiService = new AiServiceClass();