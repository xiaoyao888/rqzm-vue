<template>
  <div ref="mymodal">
    <a-modal v-model:visible="visible" class="modal" width="50%" style="top:50px;border-radius:20px;" :body-style="bgWallpaper&&bgWallpaper.indexOf('http') === 0?
       'background: url('+bgWallpaper+');background-color:rgb(0,0,0,0.5);background-size:100% 100%;':
       'background:'+bgWallpaper+';'" :closable="false" :footer="null" :getContainer = '()=>$refs.mymodal'>

      <h2><div class="ta" >{{ todayPoetry.origin.title }}</div></h2>
      <div class="ta mt">{{ todayPoetry.origin.author }} • {{ todayPoetry.origin.dynasty }}</div>
      <div class="scroller" style="height:400px;margin:0 auto;overflow-y: auto;">
        <div  class="ta mt" v-if="todayPoetry.origin.content && todayPoetry.origin.content.length>0">
          <div v-for="(item,index) in todayPoetry.origin.content" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="ta mt jrsccopy">本组件由 <a href="https://www.jinrishici.com" target = "_blank" >今日诗词</a> 提供服务</div>
      <div class="showRefresh">
        <a-button type="primary" @click="initTodayPoetry()"><Icon icon="SyncOutlined" />换一首</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import {ref, defineExpose} from "vue";
import Icon from '@/components/icon'
import dayjs from "dayjs";
import * as jinrishici from "jinrishici";
//变量
const todayPoetry = ref({
  "content": "",
  "popularity": null,
  "origin": {
    "title": "",
    "dynasty": "",
    "author": "",
    "content": [],
    "translate": null
  },
  "matchTags": [],
  "recommendedReason": "",
  "cacheAt": ""
})
const bgWallpaper = ref()
const showRefresh = ref(false)
const visible = ref(false);
//方法
const showModal = () => {
  visible.value = true;
  let lsTodayPoetry = localStorage.getItem("todayPoetry")
  if(lsTodayPoetry){
    todayPoetry.value = JSON.parse(lsTodayPoetry).data
  }
  bgWallpaper.value = localStorage.getItem('bgWallpaper')
}
//方法
const initTodayPoetry = () => {
  jinrishici.load(result => {
    if(result.data){
      todayPoetry.value = result.data
      let res = {data:result.data,"createDate":dayjs().format("YYYY-MM-DD")}
      localStorage.setItem("todayPoetry",JSON.stringify(res))
    }
  })
}
defineExpose({
  showModal
})
</script>

<style lang="less" scoped>
div /deep/ .ant-modal-content{
  border-radius:20px;
}
div /deep/ .ant-modal-body{
   border-radius:20px;
}
.ta{
  color:#ffffff;
  text-align: center;
}
.mt{
  margin-top:10px;
}
.jrsccopy{
  a{
    font-weight: 800;
  }
  margin-top:60px;
}
.showRefresh {
  color:#ffffff;
  position: absolute;
  bottom: 65px;
  left:0;
  right: 0;
  font-size: 18px;
  vertical-align: center;
}
.scroller::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scroller::-webkit-scrollbar-track {
  background-color:transparent;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius:2em;
}
.scroller::-webkit-scrollbar-thumb {
  background-color: rgba(150, 150, 157, 0.5);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius:2em;
}
</style>
