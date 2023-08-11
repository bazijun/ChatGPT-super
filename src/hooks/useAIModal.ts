import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { t } from '@/locales'
import { useUsingContext } from '@/views/chat/hooks/useUsingContext'
import { useUserStore } from '@/store'
import type { CHAT_GPT_MODEL } from '@/store/modules/user/helper'

export function useAIModel() {
  const userStore = useUserStore()
  const { usingContext, toggleUsingContext } = useUsingContext(false)
  const userInfo = computed(() => userStore.userInfo)
  const ms = useMessage()
  const aiModel = computed({
    get() {
      return userInfo.value.aiModel ?? 'gpt-3.5-turbo'
    },
    set(value: CHAT_GPT_MODEL) {
      if (usingContext.value && value.includes('gpt-4'))
        toggleUsingContext()
      userStore.updateUserInfo({ aiModel: value })
      ms.success(t('common.success'))
    },
  })
  return aiModel
}
