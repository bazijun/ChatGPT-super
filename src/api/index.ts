import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { chatGPTModelOptions, getLocalState } from '@/store/modules/user/helper'

interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

interface chatReplyRequest {
  prompt: Chat.ChatContent
  systemMessage: string
  model?: string
  maxModelTokens?: number
  options?: ChatContext
}

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: ChatContext,
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: Chat.ChatContent
    options?: ChatContext
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  const { userInfo } = getLocalState()
  const { systemMessage, aiModel } = userInfo
  const maxModelTokens = chatGPTModelOptions.find(f => f.value === aiModel)?.tokens
  return post<T>({
    url: '/chat-process',
    data: {
      systemMessage,
      maxModelTokens,
      model: aiModel,
      prompt: params.prompt,
      options: params.options,
    } as chatReplyRequest,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export const UploadUrl = 'https://bazijun.top/api/plugin/upload'
