<template>
  <div>
    <div class="widget a-button--primary" v-if="props.size==='1x1'">
      <div class="widget-1x1">
        <img :src="require('@/assets/images/logos/yiyan.svg')" style="width:100%;height:100%;" alt="每日一言"/>
      </div>
    </div>

    <div class="widget a-button--primary" v-if="props.size==='1x2'">
      <div class="widget-1x2">
        <img :src="require('@/assets/images/logos/yiyan.svg')" style="height:100%;" alt="每日一言"/>
      </div>
    </div>
    <div class="widget a-button--primary" v-if="props.size==='2x1'">
      <div class="widget-2x1">
        <img :src="require('@/assets/images/logos/yiyan.svg')" style="width:100%;" alt="每日一言"/>
      </div>
    </div>
    <div class="widget a-button--primary" v-if="props.size==='2x2'">
      <div class="widget-2x2" style="height:145px;">
        <div class="c2">{{ todayPoetry.content }}</div>
        <div class="c3">——{{ todayPoetry.origin.author }}•{{ todayPoetry.origin.dynasty }}</div>
      </div>
    </div>
    <div class="widget a-button--primary" v-if="props.size==='2x4'">
      <div class="widget-2x4" style="height:145px;">
        <div class="c2">{{ todayPoetry.content }}</div>
        <div class="c3">——{{ todayPoetry.origin.author }}•{{ todayPoetry.origin.dynasty }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps} from "vue";
import * as jinrishici from "jinrishici";
import dayjs from "dayjs";
//变量
const todayPoetry = ref({
  origin:{
    author:"",
    dynasty:""
  }
})
//方法
const initTodayPoetry = () => {
  let lsTodayPoetry = localStorage.getItem("todayPoetry");
  if(lsTodayPoetry){
    lsTodayPoetry = JSON.parse(lsTodayPoetry);
    if(lsTodayPoetry.createDate === dayjs().format("YYYY-MM-DD")){
      todayPoetry.value = lsTodayPoetry.data
      return;
    }
  }
  jinrishici.load(result => {
    if(result.data){
      todayPoetry.value = result.data
      let res = {data:result.data,"createDate":dayjs().format("YYYY-MM-DD")}
      localStorage.setItem("todayPoetry",JSON.stringify(res))
    }
  })
}
initTodayPoetry();

const props = defineProps({
  size: String
})
</script>

<style lang="less" scoped>
.widget {
  color: #ffffff;
  text-align: center;
}

.widget-1x1 {
}

.widget-1x2 {
  height:55px;
}

.widget-2x1 {
  img{
    margin-top:42px;
  }
}

.widget-2x2, .widget-2x4 {
  .c1 {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    color: #000000FF;
    background: #fefefe5a;
    line-height: 30px;
    font-size: 14px;
  }

  .c2 {
    line-height: 14px;
    font-size: 12px;
    height:100px;
    display: flex;
    align-items: center;
    text-align: start;
    padding:0 10px;
  }

  .c3 {
    font-size: 12px;
    margin-top: 10px;
    text-align: right;
    padding:0 10px;
  }
}

.showRefresh {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  font-size: 20px;
  vertical-align: center;
}
</style>
