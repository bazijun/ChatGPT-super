import type { ChatGPTAPIOptions } from 'chatgpt'
import { ChatGPTAPI } from 'chatgpt'

// 扩展该类，为了能实例中设置 `maxModelTokens` 和 `maxResponseTokens`
export class ChatGPTApiSuper extends ChatGPTAPI {
  constructor(opt: ChatGPTAPIOptions) {
    super(opt)
  }

  get maxModelTokens() {
    return this._maxModelTokens
  }

  set maxModelTokens(num: number) {
    this._maxModelTokens = num
  }

  get maxResponseTokens() {
    return this._maxResponseTokens
  }

  set maxResponseTokens(num: number) {
    this._maxResponseTokens = num
  }
}
