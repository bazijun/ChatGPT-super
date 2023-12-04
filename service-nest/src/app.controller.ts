import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { ChatgptService } from './chatgpt/chatgpt.service';

@Controller()
export class AppController {
	constructor(private readonly chatgptService: ChatgptService) {}

	@Post('session')
	session() {
		const hasAuth = true;
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
		const TokenList = ['bzj', 'jjb', 'psy', 'nn', 'zzl'];
		if (!token)
			throw new HttpException('授权码不能为空', HttpStatus.UNAUTHORIZED);

		if (!TokenList.includes(token))
			throw new HttpException('授权码无效，请联系管理员', HttpStatus.FORBIDDEN);

		return { status: 'Success', message: 'Verify successfully', data: null };
	}
}
