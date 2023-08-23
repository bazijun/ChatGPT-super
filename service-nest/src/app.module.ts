import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { ChatgptModule } from "./chatgpt/chatgpt.module";
import { isDevelopment } from "./util/is";
import * as path from "path";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: isDevelopment()
				? path.join(process.cwd(), ".env.local")
				: path.join(process.cwd(), ".env"),
		}),
		ChatgptModule,
	],
	controllers: [AppController],
})
export class AppModule {}
