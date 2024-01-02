import { Module } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { ChatgptController } from './chatgpt.controller';
import type { ChatGPTAPIOptions } from 'chatgpt';
import { ConfigService } from '@nestjs/config';
import { isDevelopment } from 'src/util/is';

@Module({
	controllers: [ChatgptController],
	providers: [
		ChatgptService,
		{
			provide: 'CHATGPT_PROVIDE',
			async useFactory(config: ConfigService) {
				// commonjs模块中加载ESM, 使用Function创建动态模块
				const importDynamic = new Function(
					'modulePath',
					'return import(modulePath)',
				);
				const { ChatGPTAPI } = await importDynamic('chatgpt');
				// 扩展该类，为了能实例中设置 `maxModelTokens` 和 `maxResponseTokens`
				class ChatGPT extends ChatGPTAPI {
					constructor(opt: ChatGPTAPIOptions) {
						super(opt);
					}
					get maxModelTokens() {
						return this._maxModelTokens;
					}
					set maxModelTokens(num: number) {
						this._maxModelTokens = num;
					}
					get maxResponseTokens() {
						return this._maxResponseTokens;
					}
					set maxResponseTokens(num: number) {
						this._maxResponseTokens = num;
					}
				}
				return new ChatGPT({
					apiKey: config.get('OPENAI_API_KEY'),
					apiBaseUrl: config.get('OPENAI_API_BASE_URL'),
					debug: isDevelopment(),
				});
			},
			inject: [ConfigService],
		},
	],
	exports: [ChatgptService],
})
export class ChatgptModule {}
