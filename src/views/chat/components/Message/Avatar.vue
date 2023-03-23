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
    <NAvatar v-if="isString(avatar) && avatar.length > 0" :src="avatar" :fallback-src="defaultAvatar" />
    <NAvatar v-else round :src="defaultAvatar" />
  </template>
  <template v-else>
    <NAvatar v-if="isString(aiAvatar) && aiAvatar.length > 0" :src="aiAvatar" :fallback-src="defaultAIAvatar" />
    <NAvatar v-else round :src="defaultAIAvatar" />
  </template>
</template>
