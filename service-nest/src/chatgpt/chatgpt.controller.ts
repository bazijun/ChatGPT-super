import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';
import { chatReplyDto } from './type';
import { Response } from 'express';
import type { ChatMessage } from 'chatgpt';

@Controller()
export class ChatgptController {
  @Inject(ChatgptService)
  private readonly chatgptService: ChatgptService;

  @Post('chat-process')
  async chatProcess(@Body() body: chatReplyDto, @Res() res: Response) {
    res.setHeader('Content-type', 'application/octet-stream');
    try {
      const {
        prompt,
        systemMessage,
        maxModelTokens,
        model = this.chatgptService.aiModel,
        options = {},
      } = body;
      let firstChunk = true;
      const result = await this.chatgptService.chatReplyProcess({
        model,
        message: prompt,
        systemMessage,
        maxModelTokens,
        lastContext: options,
        process: (chat: ChatMessage) => {
          res.write(
            firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`,
          );
          firstChunk = false;
        },
      });
      // 需要 添加 \n 前端才能正确获取到
      res.write(`\n${JSON.stringify(result.data)}`);
    } catch (error) {
      res.write(JSON.stringify(error));
    } finally {
      res.end();
    }
  }

  // 暂不支持api查询余额啦
  @Post('config')
  async configInfo() {
    const response = await this.chatgptService.chatConfig();
    return response;
  }
}
