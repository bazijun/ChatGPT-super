<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NButton, NInput, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore } from '@/components/common'

const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const show = ref(false)
const keyword = ref('')

const collapsed = computed(() => appStore.siderCollapsed)
const chatData = computed(() => chatStore.chat)
const historyData = computed(() => chatStore.history)

const dataSources = computed(() => {
  const lowerCaseVal = keyword.value.toLocaleLowerCase()
  const filterHistoryList: Chat.History[] = []
  chatData.value.forEach((f) => {
    const currentHistory = historyData.value.find(fd => fd.uuid === f.uuid)!
    const contentIsKeyword = f.data.map(m => m.text).join(' ').toLocaleLowerCase().includes(lowerCaseVal)
    const titleIsKeyword = currentHistory.title?.toLocaleLowerCase()?.includes(lowerCaseVal)
    if (contentIsKeyword || titleIsKeyword)
      filterHistoryList.push(currentHistory)
  })
  return filterHistoryList
})
const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

function handleAdd() {
  chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

// 初始化或切换为手机布局时，收起侧边栏
watch(
  isMobile,
  (val) => {
    if (val)
      appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed" :collapsed-width="0" :width="260" :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform" position="absolute" bordered :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NInput v-model:value="keyword" placeholder="输入聊天记录关键字" clearable />
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List :data-sources="dataSources" />
        </div>
        <div class="flex p-4 justify-between gap-2">
          <NButton block class="flex-1" @click="show = true">
            Prompt Store
          </NButton>
          <NButton block class="flex-1" dashed @click="handleAdd">
            New chat
          </NButton>
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <PromptStore v-model:visible="show" />
</template>
