import type { ChatMessage } from 'chatgpt'
import { isSomeDay } from 'src/utils'

interface GiftType {
  condition: boolean[]
  message: string
}

/** 礼物装饰器 */
export const GiftDecorator = (prompt: string, chatContent: ChatMessage) => {
  const PsyHb_GIFT: GiftType = {
    condition: [prompt.includes('今天') || prompt.includes('生日'), isSomeDay(7, 21)],
    message: '![image](https://cdn.bazijun.top/img/cut-cat-body.png)',
  }
  const postGift = (gift: GiftType) => {
    if (!gift.condition.includes(false))
      chatContent.text = gift.message
  }
  postGift(PsyHb_GIFT)
}
