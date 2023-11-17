import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore, useUserStore } from './store'
import { setupRouter } from './router'
import { DEFAULT_USER_INFO } from './store/modules/user/helper'

function initApp() {
  const userStore = useUserStore()
  const { aiAvatar } = DEFAULT_USER_INFO
  userStore.updateUserInfo({ aiAvatar })
}

async function bootstrap() {
  const app = createApp(App)
  setupAssets()
  setupScrollbarStyle()
  setupStore(app)
  setupI18n(app)
  await setupRouter(app)
  app.mount('#app')

  initApp()
}

bootstrap()
