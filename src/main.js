import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.variable.min.css';
import i18n from './i18n'
import '@/styles/index.less' // global css
import router from './router'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
import ColorPicker from 'colorpicker-v3'
import '@/styles/color-picker-v3.css'
let app = createApp(App);
app.use(Antd).use(i18n).use(router).use(ColorPicker).mount('#app')
