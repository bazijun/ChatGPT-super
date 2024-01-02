import { Module } from '@nestjs/common';
import { PluginController } from './Plugin.controller';

@Module({
	controllers: [PluginController],
})
export class PluginModule {}
