import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { ChatgptModule } from "./chatgpt/chatgpt.module";
import { isDevelopment } from "./util/is";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: isDevelopment() ? `src/.env.local` : `'src/.env'`,
		}),
		ChatgptModule,
	],
	controllers: [AppController],
})
export class AppModule {}
