import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'
import { GiftDecorator } from 'src/middleware/gift'
import moment from 'moment'
import { sendResponse } from '../utils'
import { isNotEmptyString } from '../utils/is'
import type { ApiModel, BalanceResponse, ChatContext, ChatGPTUnofficialProxyAPIOptions, ModelConfig } from '../types'

const ErrorCodeMessage: Record<string, string> = {
  401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
  403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[OpenAI] 错误的网关 |  Bad Gateway',
  503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[OpenAI] 网关超时 | Gateway Time-out',
  500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}

const localEnvPath = path.resolve(__dirname, '../../.env.local')
const isDevelopment = fs.existsSync(localEnvPath)

if (isDevelopment)
  dotenv.config({ path: localEnvPath })
else
  dotenv.config()

const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 30 * 1000

let apiModel: ApiModel

if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_ACCESS_TOKEN)
  throw new Error('Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable')

let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI

(async () => {
  // More Info: https://github.com/transitive-bullshit/chatgpt-api

  if (process.env.OPENAI_API_KEY) {
    const options: ChatGPTAPIOptions = {
      maxModelTokens: 8000,
      apiKey: process.env.OPENAI_API_KEY,
      debug: isDevelopment,
    }

    if (isNotEmptyString(process.env.OPENAI_API_BASE_URL))
      options.apiBaseUrl = process.env.OPENAI_API_BASE_URL

    setupProxy(options)

    api = new ChatGPTAPI({ ...options })
    apiModel = 'ChatGPTAPI'
  }
  else {
    const options: ChatGPTUnofficialProxyAPIOptions = {
      accessToken: process.env.OPENAI_ACCESS_TOKEN,
      debug: isDevelopment,
    }

    if (isNotEmptyString(process.env.API_REVERSE_PROXY))
      options.apiReverseProxyUrl = process.env.API_REVERSE_PROXY

    setupProxy(options)

    api = new ChatGPTUnofficialProxyAPI({ ...options })
    apiModel = 'ChatGPTUnofficialProxyAPI'
  }
})()

async function chatReplyProcess(
  message: string,
  systemMessage?: string,
  model?: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
  process?: (chat: ChatMessage) => void,
) {
  try {
    let options: SendMessageOptions = { timeoutMs }

    if (lastContext) {
      if (apiModel === 'ChatGPTAPI')
        options = { parentMessageId: lastContext.parentMessageId }
      else
        options = { ...lastContext }
    }
    const response = await api.sendMessage(message, {
      ...options,
      completionParams: { model },
      systemMessage,
      onProgress: (partialResponse) => {
        GiftDecorator(message, partialResponse)
        process?.(partialResponse)
      },
    })
    !isDevelopment && global.console.log('[Logger]==>',
      Object.assign(response?.detail ?? {}, {
        time: moment(new Date()).utcOffset(8).format('YYYY-MM-DD HH:mm'),
      }))
    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    const code = error.statusCode
    global.console.log('[error]==>', error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}

async function fetchBalance() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL
  if (!isNotEmptyString(OPENAI_API_KEY))
    return Promise.resolve('-')

  const API_BASE_URL = isNotEmptyString(OPENAI_API_BASE_URL)
    ? OPENAI_API_BASE_URL
    : 'https://api.openai.com'

  const [startDate, endDate] = formatDate()
  const urlUsage = `${API_BASE_URL}/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`
  try {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    const useResponse = await fetch(urlUsage, { headers })
    const usageData = await useResponse.json() as BalanceResponse
    const usage = Math.round(usageData.total_usage) / 100
    return Promise.resolve(usage ? `$${usage}` : '-')
  }
  catch {
    return Promise.resolve('-')
  }
}

async function chatConfig() {
  const balance = await fetchBalance()
  const reverseProxy = process.env.API_REVERSE_PROXY ?? '-'
  const httpsProxy = (process.env.HTTPS_PROXY || process.env.ALL_PROXY) ?? '-'
  const socksProxy = (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT)
    ? (`${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`)
    : '-'
  return sendResponse<ModelConfig>({
    type: 'Success',
    data: { apiModel, reverseProxy, timeoutMs, socksProxy, httpsProxy, balance },
  })
}

function setupProxy(options: ChatGPTAPIOptions | ChatGPTUnofficialProxyAPIOptions) {
  if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) {
    const agent = new SocksProxyAgent({
      hostname: process.env.SOCKS_PROXY_HOST,
      port: process.env.SOCKS_PROXY_PORT,
    })
    options.fetch = (url, options) => {
      return fetch(url, { agent, ...options })
    }
  }
  else {
    if (process.env.HTTPS_PROXY || process.env.ALL_PROXY) {
      const httpsProxy = process.env.HTTPS_PROXY || process.env.ALL_PROXY
      if (httpsProxy) {
        const agent = new HttpsProxyAgent(httpsProxy)
        options.fetch = (url, options) => {
          return fetch(url, { agent, ...options })
        }
      }
    }
  }
}

function currentModel(): ApiModel {
  return apiModel
}

function formatDate(): string[] {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const lastDay = new Date(year, month, 0)
  const formattedFirstDay = `${year}-${month.toString().padStart(2, '0')}-01`
  const formattedLastDay = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`
  return [formattedFirstDay, formattedLastDay]
}

export type { ChatContext, ChatMessage }

export { chatReplyProcess, chatConfig, currentModel }
