import type { ChatGPTAPI } from 'chatgpt';

export declare global {
	type AnyObject = Record<string, unknown>;

	interface ChatGPTApiProvider extends ChatGPTAPI {
		get maxModelTokens(): number;
		set maxModelTokens(num: number);
		get maxResponseTokens(): number;
		set maxResponseTokens(num: number);
	}

	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
		}
	}
}
