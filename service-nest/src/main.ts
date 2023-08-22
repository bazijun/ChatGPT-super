import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	await app.listen(3002, () => {
		import('../package.json').then((res) => {
			console.log(`【NEST_SERVICE：${res?.version} is running on port 3002】`);
		});
	});
}
bootstrap();
