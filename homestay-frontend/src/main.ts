import './assets/main.css'
import './styles/admin-theme.css'
import '@fortawesome/fontawesome-free/css/all.css'


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import type { Plugin } from 'vue'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import customIconsPlugin from './plugins/customIcons'
import { iconSwitcher } from './utils/iconSwitcher'
import { fontAwesomeCleaner } from './utils/fontAwesomeCleaner'

const app = createApp(App)

app.use(createPinia())

// 初始化认证状态
const auth = useAuthStore()
auth.initialize()

app.use(router)
app.use(ElementPlus as Plugin)
app.use(customIconsPlugin)

// 注册所有Element Plus图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

// 启用自定义图标和清理Font Awesome
setTimeout(() => {
  // 先清理Font Awesome样式
  fontAwesomeCleaner.forceCleanup()

  // 然后启用自定义图标
  iconSwitcher.enableCustomIcons()

  console.log('自定义图标已启用，Font Awesome样式已清理')
}, 500)

// 额外的清理，确保彻底移除小方块
setTimeout(() => {
  fontAwesomeCleaner.forceCleanup()
}, 2000)