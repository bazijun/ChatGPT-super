<script setup lang='ts'>
import { computed, onUnmounted } from 'vue'
import { NAvatar, useMessage } from 'naive-ui'
import { usePromptPassStore, useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'

const userStore = useUserStore()
const promptPassStore = usePromptPassStore()

const message = useMessage()

const promptPass = computed(() => promptPassStore.promptPass)
const userInfo = computed(() => userStore.userInfo)

let count = 0
let timer: NodeJS.Timeout

const comboFiveOpenPrompt = () => {
  if (!promptPass.value) {
    count++
    if (count === 5) {
      message.success(
        '解锁成功',
      )
      count = 0 // 重置计数器
      promptPassStore.updatePromptPass(true)
      clearTimeout(timer) // 清除定时器
    }
    else {
      // 设置定时器，1 秒后清空计数器
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        count = 0
      }, 1000)
    }
  }
}

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0" @click="comboFiveOpenPrompt">
      <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
        <NAvatar size="large" round :src="userInfo.avatar" :fallback-src="defaultAvatar" />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ userInfo.name ?? '小把子' }}
      </h2>
      <!-- <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span v-if="isString(userInfo.description) && userInfo.description !== ''" v-html="userInfo.description" />
      </p> -->
    </div>
  </div>
</template>
