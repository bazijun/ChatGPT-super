import { defineStore } from 'pinia'
import type { PromptPassStore } from './helper'
import { getLocalPromptPass, setLocalPromptPass } from './helper'

export const usePromptPassStore = defineStore('prompt-pass-store', {
  state: (): PromptPassStore => getLocalPromptPass(),

  actions: {
    updatePromptPass(promptPass: boolean) {
      this.$patch({ promptPass })
      setLocalPromptPass({ promptPass })
    },
    getPromptPass() {
      return this.$state
    },
  },
})
