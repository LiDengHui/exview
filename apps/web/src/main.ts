import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import 'element-plus/dist/index.css'
import './styles/main.css'

createApp(App).use(ElementPlus).use(createPinia()).use(router).mount('#app')
