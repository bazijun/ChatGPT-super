import type { ChatGPTAPI, SendMessageOptions, ChatMessage } from 'chatgpt';

export declare global {
	type AnyObject = Record<string, unknown>;
	type ChatContent = string | Record<string, string>[];
	interface ChatGPTApiProvider extends ChatGPTAPI {
		get maxModelTokens(): number;
		set maxModelTokens(num: number);
		get maxResponseTokens(): number;
		set maxResponseTokens(num: number);
		sendMessage(
			text: ChatContent,
			opts?: SendMessageOptions,
		): Promise<ChatMessage>;
	}

	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
		}
	}
}
