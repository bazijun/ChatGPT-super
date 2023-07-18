import express from 'express'
import pkg from 'package.json'
import moment from 'moment'
import type { ChatContext, ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { isNotEmptyString } from './utils/is'

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', auth, async (req, res) => {
  const OPENAI_API_MODEL = process.env.OPENAI_API_MODEL
  const defaultModel = isNotEmptyString(OPENAI_API_MODEL) ? OPENAI_API_MODEL : 'gpt-3.5-turbo'
  res.setHeader('Content-type', 'application/octet-stream')

  const today = moment(new Date()).utcOffset(8)
  global.console.log('utc8.date ===>', today)
  global.console.log('utc8.time ===>', today.toDate().toDateString())
  global.console.log('utc8.getMonth ===>', today.toDate().getMonth())
  global.console.log('utc8.getDate ===>', today.toDate().getDate())
  global.console.log('utc8.minute ===>', today.format('YYYY-MM-DD HH:mm:ss'))

  try {
    const { prompt, systemMessage, model = defaultModel, options = {} } = req.body as { prompt: string; model: string; systemMessage: string; options?: ChatContext }
    let firstChunk = true
    await chatReplyProcess(prompt, systemMessage, model, options, (chat: ChatMessage) => {
      res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
      firstChunk = false
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

app.use('', router)
app.use('/api', router)

app.listen(3002, () => globalThis.console.log(`Server:${pkg.version} is running on port 3002`))
