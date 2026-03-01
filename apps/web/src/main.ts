import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import { router } from './router'
import './styles/main.css'

createApp(App).use(ElementPlus).use(createPinia()).use(router).mount('#app')
