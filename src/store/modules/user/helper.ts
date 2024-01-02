import { ss } from '@/utils/storage'

const LOCAL_NAME = 'userStorage'

export type CHAT_GPT_MODEL =
  'gpt-3.5-turbo' |
  'gpt-3.5-turbo-16k' |
  'gpt-3.5-turbo-1106' |
  'gpt-4' |
  'gpt-4-turbo' |
  'gpt-4-1106-preview' |
  'gpt-4-vision-preview' |
  'gpt-4-0314' |
  'gpt-4-0613'

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

export interface ChatGPTModel {
  label: string
  key: string
  value: CHAT_GPT_MODEL
  tokens: number
  vision: boolean
}

export const chatGPTModelOptions: ChatGPTModel[] = [
  { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo-1106', key: 'gpt-3.5-turbo-1106', tokens: 16000, vision: false },
  { label: 'gpt-4-turbo', value: 'gpt-4-1106-preview', key: 'gpt-4-1106-preview', tokens: 128000, vision: false },
  { label: 'gpt-4-vision', value: 'gpt-4-vision-preview', key: 'gpt-4-vision-preview', tokens: 128000, vision: true },
  { label: 'gpt-4', value: 'gpt-4', key: 'gpt-4', tokens: 8000, vision: false },
  // { label: 'gpt-4-0314', value: 'gpt-4-0314', key: 'gpt-4-0314', tokens: 8000 },
  // { label: 'gpt-4-0613', value: 'gpt-4-0613', key: 'gpt-4-0613', tokens: 8000 },
]

export const DEFAULT_USER_INFO: UserState['userInfo'] = {
  avatar: 'https://cdn.bazijun.top/img/avatar.jpg',
  aiAvatar: 'https://cdn.bazijun.top/img/cut-cat1.png',
  name: '小把子',
  aiModel: chatGPTModelOptions[0].value,
  description: 'Power by <a href="https://github.com/Chanzhaoyu/chatgpt-bot" class="text-blue-500" target="_blank" >Github</a>',
  systemMessage: getDefaultSystemMessage(),
}

export function getDefaultSystemMessage() {
  return '你是ChatGPT，一种由OpenAI训练的大型语言模型。回答尽可能简洁。'
}

export function defaultSetting(): UserState {
  return {
    userInfo: DEFAULT_USER_INFO,
  }
}

export function getLocalState(): UserState {
  const localSetting: UserState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: UserState): void {
  ss.set(LOCAL_NAME, setting)
}
