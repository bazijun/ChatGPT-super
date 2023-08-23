import type { ChatMessage, FetchFn } from "chatgpt";

export interface ChatContext {
	conversationId?: string;
	parentMessageId?: string;
}

export interface ChatGPTUnofficialProxyAPIOptions {
	accessToken: string;
	apiReverseProxyUrl?: string;
	model?: string;
	debug?: boolean;
	headers?: Record<string, string>;
	fetch?: FetchFn;
}

export interface ModelConfig {
	apiModel?: ApiModel;
	reverseProxy?: string;
	timeoutMs?: number;
	socksProxy?: string;
	httpsProxy?: string;
	balance?: string;
}

export interface chatReplyOptions {
	message: string;
	systemMessage?: string;
	maxModelTokens?: number;
	model?: string;
	lastContext?: { conversationId?: string; parentMessageId?: string };
	process?: (chat: ChatMessage) => void;
}

export interface chatReplyDto {
	prompt: string;
	systemMessage: string;
	model?: string;
	maxModelTokens?: number;
	options?: ChatContext;
}

export interface BalanceResponse {
	total_usage: number;
}

export type ApiModel = "ChatGPTAPI" | "ChatGPTUnofficialProxyAPI" | undefined;
