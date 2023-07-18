import type { ChatMessage } from 'chatgpt'
import { isSomeDay, isSomeTime } from 'src/utils'

interface GiftType {
  condition: boolean[]
  message: string
  visibleOriginalAnswer?: boolean
}

/** 礼物装饰器 */
export const GiftDecorator = (prompt: string, chatContent: ChatMessage) => {
  const PsyHb_GIFT: GiftType = {
    // condition: [/今天|生日|x|y|=/.test(prompt), isSomeDay(7, 21)],
    condition: [/今天天/.test(prompt), isSomeDay(7, 18), isSomeTime(16, 20)],
    message: `小猫咪没有忘记今天是你的生日！ta说祝你生日快乐！🥳💛🎉✨🎂🥂🎁
    \n![image](https://cdn.bazijun.top/img/cut-cat-body.png)`,
    visibleOriginalAnswer: true,
  }
  const postGift = (gift: GiftType) => {
    if (!gift.condition.includes(false)) {
      const GiftBaseText = `${gift.message}\n\n---\n **\`原回答:\`** `
      const OriginalAnswer = chatContent.text.replace(GiftBaseText, '')
      chatContent.text = gift.visibleOriginalAnswer ? (GiftBaseText + OriginalAnswer) : gift.message
    }
  }
  postGift(PsyHb_GIFT)
}
