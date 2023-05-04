import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export interface UserInfo {
  avatar: string
  aiAvatar: string
  name: string
  description: string
  systemMessage: string
}

export interface UserState {
  userInfo: UserInfo
}

export const getDefaultSystemMessage = () => {
  const currentDate = new Date().toISOString().split('T')[0]
  return `你是ChatGPT，一种由OpenAI训练的大型语言模型。回答尽可能简洁。 \n知识截止日期：2021年9月1日，\n当前日期：${currentDate}。`
}

export function defaultSetting(): UserState {
  return {
    userInfo: {
      avatar: 'https://cdn.bazijun.top/img/avatar.jpg',
      aiAvatar: 'https://cdn.bazijun.top/img/hhy2.jpg',
      name: '小把子',
      description: 'Power by <a href="https://github.com/Chanzhaoyu/chatgpt-bot" class="text-blue-500" target="_blank" >Github</a>',
      systemMessage: getDefaultSystemMessage(),
    },
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
