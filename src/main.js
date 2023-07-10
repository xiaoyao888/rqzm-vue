import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import i18n from './i18n'
import '@/styles/index.less' // global css
import router from './router'

createApp(App).use(Antd).use(i18n).use(router).mount('#app')
