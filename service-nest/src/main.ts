import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	await app.listen(3002, () => {
		import('../package.json').then((res) => {
			console.log(
				`【⚡ CHATGPT_NEST_SERVICE：${res?.version} IS RUNNING ON PORT 3002 ⚡】`,
			);
		});
	});
}
bootstrap();
