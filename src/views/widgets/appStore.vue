<template>
  <div class="app-store">
    <a-modal v-model:visible="visible" style="top: 20px" :body-style="{'padding':'0 0 '}" width="920px" :footer="null" :closable="false">
      <div class="app-store-nav" style="width:95%">
        <div class="app-store-nav-title">应用商店</div>
        <div style="display:inline-flex;width:270px;">
        <div @click="showStatus=true" class="app-store-nav-item" :class="showStatus?'app-store-nav-item-selected':''"><a>小图标</a></div>
        <div @click="showStatus=false" class="app-store-nav-item" :class="!showStatus?'app-store-nav-item-selected':''"><a>小组件</a></div>
        <a-select ref="select" style="border-radius: 16px;" v-model:value="currentSection.name" @change="handleChange($event)">
          <a-select-option :value="item.name" v-for="item in sectionList.value" :key="item.name">{{item.name}}</a-select-option>
        </a-select>
        </div>
        <a-input class="app-store-nav-input" @keyup="init"/>
      </div>
      <div class="closable" @click="visible=false"><Icon icon="CloseOutlined"></Icon></div>
      <div v-if="showStatus">
        <div style="display: flex;flex-direction: row;flex-wrap:wrap;align-items: flex-start;margin-left:5px;" class="icon-nav">
          <a-tag>全部</a-tag>
          <div v-for="(item,index) in data" :key="index">
            <a-tag>{{ item }}</a-tag>
          </div>
        </div>
        <div class="icon-list">
          <div class="icon-item" v-for="(item,index) in iconList" :key="index" @mouseenter="iconMouseEnterIndex = index">
            <div style="text-align: center">
              <div style="display:flex;justify-content: space-between">
                <div>
                  <Icon style="color:#ff7a06" icon="FireFilled"></Icon>{{item.count}}
                </div>
                <a-button type="primary" size="small" @click="addIcon(item)" v-if="index === iconMouseEnterIndex" style="padding:0 4px;">
                  <Icon icon="PlusOutlined"></Icon>
                </a-button>
              </div>
              <div id="appItem4fb906f7bb9a4fdba6a0c81d652858d1" data-index="4fb906f7bb9a4fdba6a0c81d652858d1" class="app-icon" :style="'background:'+iconBackground(item)">
                <img :src="getImgUrl(item)" class="icon">
              </div>
              <div>
                {{item.name}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="widget-list" v-if="!showStatus">
        <div class="widget-item" v-for="(item,index) in widgetList" :key="index" @mouseenter="iconMouseEnterIndex = index">
          <div style="height:200px;text-align: center">
            <div style="position:relative">
              <div style="position:absolute;top:0;left:0"><Icon style="color:#ff0000" icon="FireFilled"></Icon>{{item.count}}</div>
              <div style="text-align: center;height:20px;">
                <div v-if="item.sizeList && item.sizeList.length>1">
                  <a-tag style="cursor: pointer;" :color="item.size===it?'var(--ant-primary-color)':''" @click="changeAppIconlayout(item,it)"  v-for="(it,i) in item.sizeList" :key="i">{{it}}</a-tag>
                </div>
                <div  v-if="!item.sizeList || item.sizeList.length===0">
                  <a-tag style="cursor: pointer" :color="item.size === '1x1'?'var(--ant-primary-color)':''" @click="changeAppIconlayout(item,'1x1')">1x1</a-tag>
                  <a-tag style="cursor: pointer" :color="item.size === '1x2'?'var(--ant-primary-color)':''" @click="changeAppIconlayout(item,'1x2')">1x2</a-tag>
                  <a-tag style="cursor: pointer" :color="item.size === '2x1'?'var(--ant-primary-color)':''" @click="changeAppIconlayout(item,'2x1')">2x1</a-tag>
                  <a-tag style="cursor: pointer" :color="item.size === '2x2'?'var(--ant-primary-color)':''" @click="changeAppIconlayout(item,'2x2')">2x2</a-tag>
                  <a-tag style="cursor: pointer" :color="item.size === '2x4'?'var(--ant-primary-color)':''" @click="changeAppIconlayout(item,'2x4')">2x4</a-tag>
                </div>
              </div>
              <a-button type="primary" size="small"
                        @click="addIcon(item)" v-if="index === iconMouseEnterIndex"
                        style="padding:0 4px;position:absolute;top:0;right:0">
                <Icon icon="PlusOutlined" ></Icon>
              </a-button>
            </div>
            <div class="app-icon" :class="'icon-size-'+(item.size)" :style="'background:'+item.backgroundColor">
              <img v-if="item.type==='component' && item.component==='icon'" alt=""
                   :src="getImgUrl(item)" class="icon" :class="'img-'+(item.size)">
              <countdown-widget v-else-if="item.component==='countdown'||item.component==='countdownTime'"
                                :size="item.size" :form="item"/>
              <calendar-widget v-else-if="item.component==='calendar'" :size="item.size"/>
              <today-english-widget v-else-if="item.component==='todayEnglish'" :size="item.size"/>
              <today-sentence-widget v-else-if="item.component==='todaySentence'" :size="item.size"/>
              <today-poetry-widget v-else-if="item.component==='todayPoetry'" :size="item.size"/>
              <hotrank-widget v-else-if="item.component==='hotRank'" :widgetProps="item"></hotrank-widget>
              <ai-assistant-widget v-else-if="item.component==='AIAssistant'"
                                   :widgetProps="item"/>
            </div>
            <div style="margin-top:10px;">{{item.name}}</div>
          </div>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script setup>
import {ref, defineExpose, reactive, defineEmits, defineComponent} from "vue";
import Icon from '@/components/icon'
import {message} from "ant-design-vue";
import {useI18n} from "vue-i18n";

import countdownWidget from "@/views/widgets/countdownWidget";
import calendarWidget from "@/views/widgets/calendarWidget";
import HotrankWidget from "@/views/widgets/hotrankWidget";
import TodayPoetryWidget from "@/views/widgets/todayPoetryWidget";
import TodaySentenceWidget from "@/views/widgets/todaySentenceWidget";
import TodayEnglishWidget from "@/views/widgets/todayEnglishWidget";

const { locale} = useI18n()
const visible = ref(false)
const iconMouseEnterIndex =ref()
const data = ['AI','热门','新闻','视频','音乐','图片','效率','开发','学习','游戏','购物','社交','阅读','出行','金融','其他'];
const showStatus = ref(true)
const widgetList = reactive([])
const iconList = reactive([])
const sectionList = reactive([])
const currentSection = reactive({
  name: "",
  index: 0
})

const showModal=()=>{
  visible.value = true
  init()
}
const init =()=> {
  let iconData = require('@/assets/json/iconData.json');
  if(iconData){
    for(let item of iconData){
      for(let it of item.children) {
        it.count = Number.parseInt(Math.random()*1000)
        if (it.type === 'component') {
          widgetList.push(it)
        } else {
          iconList.push(it)
        }
      }
    }
  }
  let iconDefaultData = localStorage.getItem('iconDefaultData') || []
  if(iconDefaultData){
    if (iconDefaultData.length > 0) {
      iconDefaultData = JSON.parse(iconDefaultData);
    }
    let arr = []
    let index =0;
    for(let item of iconDefaultData){
      if(index === 0){
        currentSection.name = locale.value === 'zh_cn'?item.name:item.nameEn
        currentSection.index = 0
      }
      arr.push({id:item.id,name:item.name,nameEn:item.nameEn,index:index})
      index++;
    }
    sectionList.value = arr
  }
}
const handleChange=(name)=>{
  currentSection.name = name
  for (let idd of sectionList.value) {
    if (idd.name === name) {
      currentSection.index = idd.index
      return
    }
  }
}
const addIcon = (item) =>{
  let iconDefaultData = localStorage.getItem('iconDefaultData') || []
  if (iconDefaultData) {
    if (iconDefaultData.length > 0) {
      iconDefaultData = JSON.parse(iconDefaultData);
    }
    const children = iconDefaultData[currentSection.index].children
    for(let it of children) {
      if (it.id === item.id) {
        message.warning(it.name + '，已经添加过了！');
        return;
      }
    }
    iconDefaultData[currentSection.index].children.push(JSON.parse(JSON.stringify(item)))
    localStorage.setItem("iconDefaultData", JSON.stringify(iconDefaultData))
    emits("addIcon", {app:item,index:currentSection.index})
    message.success(item.name+'，添加成功！');
  }
}
const getImgUrl = (item)=>{
  if (!item.src) {
    return;
  }
  try {
    return require('@/assets/images/logos/' + item.src + "");
  } catch (e) {}
}

const iconBackground = (app) => {
  if (app.backgroundColor) {
    return app.backgroundColor;
  } else {
    if (app.config && app.config.bgColor) {
      return app.config.bgColor;
    } else {
      return '#ffffff'
    }
  }
}
const changeAppIconlayout = (app,size)=>{
  app.size = size
}
defineComponent({
  countdownWidget,
  calendarWidget,
  TodayEnglishWidget,
  TodaySentenceWidget,
  TodayPoetryWidget
})
defineExpose({
  showModal
})
const emits = defineEmits(["addIcon"])
</script>
<style lang="less" scoped>
.app-store-nav {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left:7px;
}
.app-store-nav-item {
  width: 80px;
  background: #ffffff;
  text-align: center;
  line-height: 32px;
  border-radius: 5px;
  margin-right:10px;
}
.app-store-nav-section{
  line-height: 32px;
  width: 120px;
  border-radius: 16px;
}
.app-store-nav-item-selected{
  background: var(--ant-primary-color);
  color:#ffffff;
}
.app-store-nav-title{
  line-height: 32px;
  font-size:16px;
  margin-left:20px;
}
.app-store-nav-input{
  width:200px;
  border-radius:16px;
}
.widget-list{
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: flex-start;
  height:600px;
  overflow-y:auto;
  padding-left:7px;
  &::-webkit-scrollbar {
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(144, 147, 153, 0.5);
  }
  &::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background: transparent;
  }
}
.widget-item{
  background:#ffffff;
  box-shadow: 0 1px 13px 1px #0000002a;
  width: 432px;
  height: 245px;
  margin:8px;
  padding:10px;
  border-radius: 10px;
  button{
    border-radius:12px;
  }
  .icon-size-1x1{
    width:55px;
    height:55px;
  }
  .icon-size-1x2{
    width:145px;
    height:55px;
  }
  .icon-size-2x1{
    width:55px;
    height:145px;
  }
  .icon-size-2x2{
    width:145px;
    height:145px;
  }
  .icon-size-2x4{
    width:325px;
    height:145px;
  }
  :deep .ant-tag{
    border-radius: 10px;
  }
}

.icon-nav :deep .ant-tag{
  min-width:53px;
  text-align:center;
  margin-top:10px;
  cursor:pointer;
}
.icon-list{
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: flex-start;
  height:600px;
  overflow-y:auto;
  padding-left:7px;
  &::-webkit-scrollbar {
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(144, 147, 153, 0.5);
  }
  &::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background: transparent;
  }
}
.icon-item{
  background:#ffffff;
  box-shadow: 0 1px 13px 1px #0000002a;
  width: 188px;
  height: 150px;
  margin:8px;
  padding:10px;
  border-radius: 10px;
  button{
    border-radius:12px;
  }

}
.app-icon {
  position: relative;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: var(--icon-bg-radius);
  background-color: #fff;
  margin:0 auto;
  margin-top:10px;
  box-shadow: 0 0 10px 3px #0000001a;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate3d(-50%, -50%, 0);
    top: 50%;
    left: 50%
  }
}
</style>
