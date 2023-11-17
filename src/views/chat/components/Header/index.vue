<script lang="ts" setup>
import { computed, nextTick } from 'vue'
import { NDropdown } from 'naive-ui'
import { HoverButton, SvgIcon } from '@/components/common'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { chatGPTModelOptions } from '@/store/modules/user/helper'
import { useAIModel } from '@/hooks/useAIModal'

interface Props {
  usingContext: boolean
}

interface Emit {
  (ev: 'export'): void
  (ev: 'toggleUsingContext'): void
  (ev: 'handleClear'): void
}

defineProps<Props>()

const emit = defineEmits<Emit>()

const { isMobile } = useBasicLayout()

const aiModel = useAIModel()

const aiModelLabel = computed(() => chatGPTModelOptions?.find(f => f.value === aiModel.value)?.label)

const appStore = useAppStore()
const chatStore = useChatStore()

const collapsed = computed(() => appStore.siderCollapsed)
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

function onScrollToTop() {
  const scrollRef = document.querySelector('#scrollRef')
  if (scrollRef)
    nextTick(() => scrollRef.scrollTop = 0)
}

function handleExport() {
  emit('export')
}

function toggleUsingContext() {
  emit('toggleUsingContext')
}

function handleClear() {
  emit('handleClear')
}
</script>

<template>
  <header
    class="sticky top-0 left-0 right-0 z-30 border-b bg-white/80 dark:bg-black/20 backdrop-blur dark:border-neutral-700"
  >
    <div class="relative flex items-center justify-between min-w-0 overflow-hidden h-14">
      <div v-if="isMobile" class="flex items-center">
        <button class="flex items-center justify-center w-11 h-11" @click="handleUpdateCollapsed">
          <SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
          <SvgIcon v-else class="text-2xl" icon="ri:align-right" />
        </button>
      </div>
      <h1
        class="flex-1 px-4 pr-6 overflow-hidden cursor-pointer select-none text-ellipsis whitespace-nowrap"
        @dblclick="onScrollToTop"
      >
        {{ currentChatHistory?.title ?? '' }}
      </h1>
      <div class="flex items-center space-x-1">
        <HoverButton @click="toggleUsingContext">
          <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
            <SvgIcon icon="ri:chat-history-line" />
          </span>
        </HoverButton>
        <HoverButton @click="handleExport">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:download-2-line" />
          </span>
        </HoverButton>
        <HoverButton @click="handleClear">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:delete-bin-line" />
          </span>
        </HoverButton>
      </div>
    </div>
  </header>
  <NDropdown
    v-if="isMobile ? collapsed : true" trigger="click" :options="chatGPTModelOptions"
    @select="val => aiModel = val"
  >
    <div
      class="absolute top-12 left-1/2 -translate-x-1/2 z-[99] flex gap-2 items-center  cursor-pointer select-none rounded-md border bg-white px-4  dark:bg-[#111114] dark:border-neutral-700 text-[#4b9e5f] dark:text-[#63E2B7]"
    >
      <SvgIcon icon="ri:sparkling-2-line" />
      <span class="whitespace-nowrap">{{ aiModelLabel }}</span>
      <SvgIcon icon="mingcute:down-line" />
    </div>
  </NDropdown>
</template>
