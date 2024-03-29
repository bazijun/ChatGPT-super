<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NSpin, NText } from 'naive-ui'
import { fetchChatConfig } from '@/api'
import pkg from '@/../package.json'
import { useAuthStore } from '@/store'

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  balance?: string
}

const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>()

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-bold">
      Version - {{ pkg.version }}
    </h2>
    <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
      <p>
        此项目开源于
        <a class="text-blue-600 dark:text-blue-500" target="_blank">Github</a>
        ，免费且基于 MIT 协议，没有任何形式的付费行为！
      </p>
      <p>
        如果你觉得此项目对你有帮助，请在 Github 帮我点个  Star
        或者给予一点赞助，谢谢！
      </p>
    </div>
    <NSpin :show="loading">
      <p>
        {{ $t("setting.api") }}：<NText type="success">
          {{ config?.apiModel ?? '-' }}
        </NText>
      </p>
      <p v-if="isChatGPTAPI">
        {{ $t("setting.balance") }}：<NText type="success">
          {{ config?.balance ?? '-' }}
        </NText>
      </p>
      <p v-if="!isChatGPTAPI">
        {{ $t("setting.reverseProxy") }}：<NText type="success">
          {{ config?.reverseProxy ?? '-' }}
        </NText>
      </p>
      <p>
        {{ $t("setting.timeout") }}：<NText type="success">
          {{ config?.timeoutMs ?? '-' }}
        </NText>
      </p>
    </NSpin>
  </div>
</template>
