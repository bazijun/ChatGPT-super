<script lang="ts" setup>
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import { useUserStore } from '@/store'
import { DEFAULT_USER_INFO } from '@/store/modules/user/helper'

interface Props {
  image?: boolean
}
defineProps<Props>()
const userStore = useUserStore()
const avatar = computed(() => userStore.userInfo.avatar ?? DEFAULT_USER_INFO.avatar)
const aiAvatar = computed(() => userStore.userInfo.aiAvatar ?? DEFAULT_USER_INFO.aiAvatar)
</script>

<template>
  <template v-if="image">
    <NAvatar :src="avatar" :fallback-src="DEFAULT_USER_INFO.avatar" :size="48" />
  </template>
  <template v-else>
    <NAvatar :src="aiAvatar" :fallback-src="DEFAULT_USER_INFO.aiAvatar" :size="48" />
  </template>
</template>
