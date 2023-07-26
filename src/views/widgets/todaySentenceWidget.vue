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
    <div class="widget a-button--primary" v-if="props.size==='2x2'" @mouseover="showRefresh = true" @mouseleave="showRefresh=false">
      <div class="widget-2x2" style="height:145px;">
        <div class="c2">{{ todaySentence.hitokoto }}</div>
        <div class="c3">——{{ todaySentence.from }}</div>
        <div v-if="showRefresh" class="showRefresh" @click="initTodaySentence()">
          <Icon icon="SyncOutlined"/>
        </div>
      </div>
    </div>
    <div class="widget a-button--primary" v-if="props.size==='2x4'" @mouseover="showRefresh = true" @mouseleave="showRefresh=false">
      <div class="widget-2x4" style="height:145px;">
        <div class="c2">{{ todaySentence.hitokoto }}</div>
        <div class="c3">——{{ todaySentence.from }}</div>
        <div v-if="showRefresh" class="showRefresh" @click="initTodaySentence()">
          <Icon icon="SyncOutlined"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import {ref, defineProps} from "vue";
import Icon from '@/components/icon'
//变量
const todaySentence = ref({})
const showRefresh = ref(false)
//方法
const initTodaySentence = () => {
  axios.get("/todaySentence").then((res) => {
    if (res.status === 200) {
      todaySentence.value = res.data;
    }
  });
}
initTodaySentence();

const props = defineProps({
  size: String
})
</script>

<style lang="less" scoped>
.widget {
  color: #ffffff;
  text-align: center;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  background:#2d4f59;
  padding:10px;
}

.widget-1x1 {
  .c2 {
    line-height: 57px;
    font-size: 30px;
  }
}

.widget-1x2 {
  .c2 {
    line-height: 57px;
    font-size: 14px;
    background: #ff5a5d;
    color: #fff;
  }
}

.widget-2x1 {
  .c1 {
    margin-top: 10px;
    font-size: 13px;
  }

  .c2 {
    line-height: 50px;
    font-size: 36px;
  }

  .c3 {
    font-size: 13px;
    line-height: 30px;
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
  }

  .c3 {
    font-size: 12px;
    margin-top: 10px;
    text-align: right;
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
