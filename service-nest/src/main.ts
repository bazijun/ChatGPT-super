import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	const configService = app.get(ConfigService);
	const CONTAINER_PORT = configService.get('CONTAINER_PORT');
	const HOST_PORT = configService.get('HOST_PORT');
	await app.listen(CONTAINER_PORT, () => {
		import('../package.json').then((res) => {
			console.log(
				`【⚡ CHATGPT_NEST_SERVICE：${res?.version} IS RUNNING ON PORT ${HOST_PORT} ⚡】`,
			);
		});
	});
}
bootstrap();
