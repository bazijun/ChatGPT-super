<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { onMounted } from 'vue'
import { useUserStore } from './store/modules/user'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
const userStore = useUserStore()

// Init App
onMounted(() => {
  userStore.updateUserInfo({
    aiAvatar: 'https://cdn.bazijun.top/img/cut-cat1.png',
    aiModel: 'gpt-3.5-turbo',
  })
})
</script>

<template>
  <NConfigProvider class="h-full" :theme="theme" :theme-overrides="themeOverrides" :locale="language">
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>
