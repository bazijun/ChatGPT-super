import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { isNotEmptyString } from './util/is';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
	constructor(
		private readonly chatgptService: ChatgptService,
		private readonly config: ConfigService,
	) {}

	@Post('session')
	session(): {
		status: string;
		message: string;
		data: {
			auth: boolean;
			model: import('d:/1workspace/my-project/ChatGPT-super/service-nest/src/chatgpt/type').ApiModel;
		};
	} {
		const AUTH_SECRET_KEY = this.config.get('AUTH_SECRET_KEY');
		const hasAuth = isNotEmptyString(AUTH_SECRET_KEY);
		return {
			status: 'Success',
			message: '',
			data: {
				auth: hasAuth,
				model: this.chatgptService.apiModel,
			},
		};
	}

	@Post('verify')
	verify(@Body() body: { token: string }) {
		const { token } = body;
		if (!token)
			throw new HttpException(
				'token不能为空 | Secret key is empty',
				HttpStatus.UNAUTHORIZED,
			);

		if (this.config.get('AUTH_SECRET_KEY') !== token)
			throw new HttpException(
				'token无效 | Secret key is invalid',
				HttpStatus.FORBIDDEN,
			);

		return { status: 'Success', message: 'Verify successfully', data: null };
	}
}
