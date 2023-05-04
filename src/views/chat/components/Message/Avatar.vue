<script lang="ts" setup>
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import { useUserStore } from '@/store'
import { isString } from '@/utils/is'
import defaultAvatar from '@/assets/avatar.jpg'
import defaultAIAvatar from '@/assets/gpt.jpg'

interface Props {
  image?: boolean
}
defineProps<Props>()
const userStore = useUserStore()

const avatar = computed(() => userStore.userInfo.avatar)
const aiAvatar = computed(() => userStore.userInfo.aiAvatar)
</script>

<template>
  <template v-if="image">
    <NAvatar v-if="isString(avatar) && avatar.length > 0" :src="avatar" :fallback-src="defaultAvatar" :size="48" />
    <NAvatar v-else :src="defaultAvatar" :size="48" />
  </template>
  <template v-else>
    <NAvatar v-if="isString(aiAvatar) && aiAvatar.length > 0" :src="aiAvatar" :fallback-src="defaultAIAvatar" :size="48" />
    <NAvatar v-else :src="defaultAIAvatar" :size="48" />
  </template>
</template>
