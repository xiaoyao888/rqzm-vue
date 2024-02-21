<template>
  <a-config-provider>
    <router-view />
  </a-config-provider>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import {ConfigProvider} from "ant-design-vue";
import {reactive} from "vue";
const {locale} = useI18n()
const language = localStorage.getItem("language");
if(language && language==='en_us'){
  locale.value = 'en_us'
  dayjs.locale('en');
}else{
  locale.value = 'zh_cn'
  dayjs.locale('zh-cn');
}
const colorState = reactive({
  primaryColor: '#1890ff',
});
if(localStorage.getItem("theme")){
  Object.assign(colorState, {
    ["primaryColor"]: localStorage.getItem("theme"),
  });
  ConfigProvider.config({
    theme: colorState,
  });
}


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
