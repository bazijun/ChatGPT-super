import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { isDevelopment } from './util/is';
import * as path from 'path';
import { PluginModule } from './plugin/plugin.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: isDevelopment()
				? path.join(process.cwd(), '.env.local')
				: path.join(process.cwd(), '.env'),
		}),
		ChatgptModule,
		PluginModule,
	],
	controllers: [AppController],
})
export class AppModule {}
