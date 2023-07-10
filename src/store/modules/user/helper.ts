import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export type CHAT_GPT_MODEL = 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k' | 'gpt-4' | 'gpt-4-0314' | 'gpt-4-0613'

export const chatGPTModelOptions: { label: string; key: string; value: CHAT_GPT_MODEL }[] = [
  { label: 'gpt-3.5-turbo-16k', value: 'gpt-3.5-turbo-16k', key: 'gpt-3.5-turbo-16k' },
  { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo', key: 'gpt-3.5-turbo' },
  { label: 'gpt-4', value: 'gpt-4', key: 'gpt-4' },
  { label: 'gpt-4-0314', value: 'gpt-4-0314', key: 'gpt-4-0314' },
  { label: 'gpt-4-0613', value: 'gpt-4-0613', key: 'gpt-4-0613' },
]

export interface UserInfo {
  avatar: string
  aiAvatar: string
  name: string
  aiModel: CHAT_GPT_MODEL
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
      aiAvatar: 'https://cdn.bazijun.top/img/cut-cat1.png',
      name: '小把子',
      aiModel: 'gpt-3.5-turbo-16k',
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
