import { ss } from '@/utils/storage'

const LOCAL_NAME = 'prompt-pass'

export interface PromptPassStore {
  promptPass: boolean
}

export function getLocalPromptPass(): PromptPassStore {
  const promptStore: PromptPassStore | undefined = ss.get(LOCAL_NAME)
  return promptStore ?? { promptPass: false }
}

export function setLocalPromptPass(promptPass: PromptPassStore): void {
  ss.set(LOCAL_NAME, promptPass)
}
