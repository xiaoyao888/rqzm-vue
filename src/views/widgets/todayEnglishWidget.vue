<template>
  <div>
    <div class="widget a-button--primary" v-if="props.size==='1x1'">
      <div class="widget-1x1">

      </div>
    </div>

    <div class="widget a-button--primary" v-if="props.size==='1x2'">
      <div class="widget-1x2">

      </div>
    </div>
    <div class="widget a-button--primary" v-if="props.size==='2x1'">
      <div class="widget-2x1">

      </div>
    </div>
    <div :style="'background:url(' + todayEnglish.picture3+');background-size:100% 100%;'">
      <div class="widget a-button--primary" v-if="props.size==='2x2'">
        <div class="widget-2x2" style="height:145px;">
          <div class="c1" style="display: flex;flex-direction: row;justify-content: space-around;font-size:14px;">
            <div @click="prevDate(1)"><Icon icon="LeftCircleOutlined" /></div>
            <div >{{todayEnglish.title}}</div>
            <div @click="nextDate(2)"><Icon icon="RightCircleOutlined"/></div>
          </div>
          <div class="c2">{{todayEnglish.content}}</div>
          <div class="c3">{{todayEnglish.note}}</div>
          <div v-if="showPlay" class="showPlay">
            <Icon v-if="!playStatus"  icon="PlayCircleFilled" @click="play(true)"/>
            <Icon v-else icon="PauseCircleFilled" @click="play(false)"/>
          </div>
        </div>
      </div>
    </div>
    <div :style="'background:url(' + todayEnglish.picture+');background-size:100% 100%;'">
      <div class="widget a-button--primary" v-if="props.size==='2x4'" @mouseover="showPlay = true" @mouseleave="showPlay=false">
        <div class="widget-2x4" style="height:145px;">
          <div class="c1" style="">
            <div @click="prevDate(1)">上一日</div>
            <div >{{todayEnglish.title}}</div>
            <div @click="nextDate(2)">下一日</div>
          </div>
          <div class="c2">{{todayEnglish.content}}</div>
          <div class="c3">{{todayEnglish.note}}</div>
          <div v-if="showPlay" class="showPlay">
            <Icon v-if="!playStatus" icon="PlayCircleFilled" @click="play(true)"/>
            <Icon v-else icon="PauseCircleFilled" @click="play(false)"/>
          </div>
        </div>
      </div>
    </div>
    <audio ref="playAudio" :src="todayEnglish.tts" @ended="playStatus=false"/>
  </div>
</template>

<script setup>
import axios from 'axios'
import {ref,defineProps} from "vue";
import dayjs from 'dayjs'
import Icon from '@/components/icon'
//变量
const todayEnglish = ref({})
const showPlay = ref(false)
const playStatus = ref(false)
const playAudio = ref()
//方法
const initTodayEnglish = (date)=>{
  let api = '/index.php?c=dailysentence&m=getdetail&title='+ date
  axios.get("/todayEnglish"+api).then((res)=>{
    if(res.status===200){
      todayEnglish.value = res.data;
    }
  });
}
const prevDate = ()=>{
  let date = dayjs(todayEnglish.value.title).toDate().getTime() - 86400000
  initTodayEnglish(dayjs(date).format("YYYY-MM-DD"));
}
const nextDate = ()=>{
  let date = dayjs(todayEnglish.value.title).toDate().getTime() + 86400000
  initTodayEnglish(dayjs(date).format("YYYY-MM-DD"));
}
const play = (flag)=>{
  playStatus.value = flag;
  if(flag){
    playAudio.value.play()
  }else{
    playAudio.value.pause()
  }
}
initTodayEnglish(dayjs().format("YYYY-MM-DD"));

const props = defineProps({
  size:String
})
</script>

<style lang="less" scoped>
.widget{
  color:#ffffff;
  text-align: center;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  background: #0000005a;
}
.widget-1x1{
  .c2{
    line-height:57px;
    font-size:30px;
  }
}
.widget-1x2{
  .c2{
    line-height:57px;
    font-size:14px;
    background:#ff5a5d;
    color:#fff;
  }
}
.widget-2x1{
  .c1{
    margin-top:10px;
    font-size:13px;
  }
  .c2{
    line-height:50px;
    font-size:36px;
  }
  .c3{
    font-size:13px;line-height:30px;
  }
}
.widget-2x2,.widget-2x4{
  .c1{
    display: flex;flex-direction: row;justify-content: space-around;
    width:100%;
    color: #000000FF;
    background: #fefefe5a;
    line-height:30px;
    font-size:14px;
  }
  .c2{
    line-height:14px;
    font-size:12px;
    margin-top: 10px;
  }
  .c3{
    font-size:12px;
    margin-top: 10px;
  }
}
.showPlay{
  position: absolute;top:60px;left:0;right:0;font-size:30px;
}
</style>
