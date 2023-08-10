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
    <div class="widget a-button--primary" v-if="props.size==='2x2'" @mouseover="showRefresh = true" @mouseleave="showRefresh=false">
      <div class="widget-2x2" style="height:145px;">
        <div class="c2">{{ todayPoetry.content }}</div>
        <div class="c3">——{{ todayPoetry.origin.author }}•{{ todayPoetry.origin.dynasty }}</div>
        <div v-if="showRefresh" class="showRefresh" >
          <Icon icon="SyncOutlined" @click="initTodayPoetry()"/>
        </div>
      </div>
    </div>
    <div class="widget a-button--primary" v-if="props.size==='2x4'" @mouseover="showRefresh = true" @mouseleave="showRefresh=false">
      <div class="widget-2x4" style="height:145px;">
        <div class="c2">{{ todayPoetry.content }}</div>
        <div class="c3">——{{ todayPoetry.origin.author }}•{{ todayPoetry.origin.dynasty }}</div>
        <div v-if="showRefresh" class="showRefresh" >
          <Icon icon="SyncOutlined" @click="initTodayPoetry()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps} from "vue";
import Icon from '@/components/icon'
import * as jinrishici from "jinrishici";
//变量
const todayPoetry = ref({
  origin:{
    author:"",
    dynasty:""
  }
})
const showRefresh = ref(false)
//方法
const initTodayPoetry = () => {
  jinrishici.load(result => {
    todayPoetry.value = result.data
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
