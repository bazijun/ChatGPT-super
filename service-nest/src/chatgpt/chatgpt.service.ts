import {
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { formatDate, isSomeDay, sendResponse } from 'src/util';
import { isDevelopment, isNotEmptyString } from 'src/util/is';
import {
	ApiModel,
	BalanceResponse,
	ModelConfig,
	chatReplyOptions,
} from './type';
import type { ChatMessage, SendMessageOptions } from 'chatgpt';
import * as moment from 'moment';

@Injectable()
export class ChatgptService {
	@Inject('CHATGPT_PROVIDE') private chatGPTApi: ChatGPTApiProvider;
	private timeoutMs: number;
	private logger = new Logger();
	public isDevelopment: boolean;
	public aiModel: string;
	public apiModel: ApiModel = 'ChatGPTAPI';
	private ErrorCodeMessage = {
		401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
		403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
		502: '[OpenAI] 错误的网关 |  Bad Gateway',
		503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
		504: '[OpenAI] 网关超时 | Gateway Time-out',
		500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
	};

	constructor(private config: ConfigService) {
		if (!config.get('OPENAI_API_KEY'))
			throw new HttpException(
				'Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable',
				HttpStatus.UNAUTHORIZED,
			);
		this.aiModel = config.get('OPENAI_API_MODEL') || 'gpt-3.5-turbo';
		this.isDevelopment = isDevelopment();
		this.timeoutMs = !isNaN(+config.get('TIMEOUT_MS'))
			? +config.get('TIMEOUT_MS')
			: 30 * 1000;
	}

	async chatReplyProcess(opt: chatReplyOptions) {
		try {
			const {
				model,
				message,
				lastContext,
				systemMessage,
				maxModelTokens,
				process,
			} = opt;
			let options: SendMessageOptions = { timeoutMs: this.timeoutMs };
			if (maxModelTokens) this.chatGPTApi.maxModelTokens = maxModelTokens;
			if (lastContext) {
				options = { parentMessageId: lastContext.parentMessageId };
			}
			const response = await this.chatGPTApi.sendMessage(message, {
				...options,
				completionParams: { model },
				systemMessage,
				onProgress: (partialResponse) => {
					this.GiftDecorator(message, partialResponse);
					process?.(partialResponse);
				},
			});
			!this.isDevelopment &&
				this.logger.log(
					Object.assign(response?.detail ?? {}, {
						overTime: moment(new Date())
							.utcOffset(8)
							.format('YYYY-MM-DD HH:mm'),
					}),
					ChatgptService.name,
				);
			return sendResponse({ type: 'Success', data: response });
		} catch (error) {
			const code = error.statusCode;
			this.logger.error(error, ChatgptService.name);
			if (Reflect.has(this.ErrorCodeMessage, code))
				return sendResponse({
					type: 'Fail',
					message: this.ErrorCodeMessage[code],
				});
			return sendResponse({
				type: 'Fail',
				message: error.message ?? 'Please check the back-end console',
			});
		}
	}

	async chatConfig() {
		const balance = await this.fetchBalance();
		const reverseProxy = this.config.get('API_REVERSE_PROXY') ?? '-';
		const httpsProxy =
			(this.config.get('HTTPS_PROXY') || this.config.get('ALL_PROXY')) ?? '-';
		const socksProxy =
			this.config.get('SOCKS_PROXY_HOST') && this.config.get('SOCKS_PROXY_PORT')
				? `${this.config.get('SOCKS_PROXY_HOST')}:${this.config.get(
						'SOCKS_PROXY_PORT',
				  )}`
				: '-';
		return sendResponse<ModelConfig>({
			type: 'Success',
			data: {
				apiModel: this.apiModel,
				timeoutMs: this.timeoutMs,
				reverseProxy,
				socksProxy,
				httpsProxy,
				balance,
			},
		});
	}

	async fetchBalance() {
		const OPENAI_API_KEY = this.config.get('OPENAI_API_KEY');
		const OPENAI_API_BASE_URL = this.config.get('OPENAI_API_BASE_URL');
		if (!isNotEmptyString(OPENAI_API_KEY)) return Promise.resolve('-');
		const API_BASE_URL = isNotEmptyString(OPENAI_API_BASE_URL)
			? OPENAI_API_BASE_URL
			: 'https://this.chatGPTApi.openai.com';

		const [startDate, endDate] = formatDate();
		const urlUsage = `${API_BASE_URL}/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`;
		try {
			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${OPENAI_API_KEY}`,
			};
			const useResponse = await fetch(urlUsage, { headers });
			const usageData = (await useResponse.json()) as BalanceResponse;
			const usage = Math.round(usageData.total_usage) / 100;
			return Promise.resolve(usage ? `$${usage}` : '-');
		} catch {
			return Promise.resolve('-');
		}
	}

	/** 🎁礼物装饰器 */
	GiftDecorator(prompt: ChatContent, chatContent: ChatMessage) {
		interface GiftType {
			condition: boolean[];
			message: string;
			visibleOriginalAnswer?: boolean;
		}
		const textPrompt = Array.isArray(prompt)
			? prompt?.find((f) => f.type == 'text')?.text
			: prompt;
		const PsyHb_GIFT: GiftType = {
			condition: [/今|天|生|日|x|y|=/.test(textPrompt), isSomeDay(7, 21)],
			message: `小猫咪没有忘记今天是你的生日！ta说祝你生日快乐！🥳💛🎉✨🎂🥂🎁
      \n![image](https://cdn.bazijun.top/img/cut-cat-body.png)`,
			visibleOriginalAnswer: true,
		};
		const postGift = (gift: GiftType) => {
			if (!gift.condition.includes(false)) {
				const GiftBaseText = `${gift.message}\n\n---\n **\`原回答:\`** `;
				const OriginalAnswer = chatContent.text.replace(GiftBaseText, '');
				chatContent.text = gift.visibleOriginalAnswer
					? GiftBaseText + OriginalAnswer
					: gift.message;
			}
		};
		postGift(PsyHb_GIFT);
	}
}
