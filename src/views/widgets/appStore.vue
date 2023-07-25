<template>
  <div class="app-store">
    <a-modal v-model:visible="visible" style="top: 20px" :body-style="{'background-color':'#f1f0f5','padding':'0 0 '}" width="920px" :footer="null" :closable="false">
      <div class="closable" @click="visible=false"><Icon icon="CloseOutlined"></Icon></div>
      <div class="app-store-nav">
        <div @click="showStatus=true" class="app-store-nav-item" :class="showStatus?'app-store-nav-item-selected':''"><a>小图标</a></div>
        <div @click="showStatus=false" class="app-store-nav-item" :class="!showStatus?'app-store-nav-item-selected':''"><a>小组件</a></div>
        <a-select ref="select" style="border-radius: 16px;" v-model:value="currentSection.name" @change="handleChange($event)">
          <a-select-option :value="item.name" v-for="item in sectionList.value" :key="item.name">{{item.name}}</a-select-option>
        </a-select>
        <div class="app-store-nav-title">应用商店</div>
        <a-input class="app-store-nav-input" @keyup="init"/>
      </div>
      <div class="icon-list" v-if="showStatus">
        <div class="icon-item" v-for="(item,index) in iconList" :key="index">
          <div style="height:100px;text-align: center">
            <div>
              {{item.name}}
            </div>
            <div id="appItem4fb906f7bb9a4fdba6a0c81d652858d1" data-index="4fb906f7bb9a4fdba6a0c81d652858d1" class="app-icon" :style="'background:'+iconBackground(item)">
              <img :src="getImgUrl(item)" class="icon">
            </div>
          </div>
          <div style="display:flex;justify-content: space-between">
            <div style="width:100px;"><Icon style="color:#ff7a06" icon="FireFilled"></Icon>{{Number.parseInt(Math.random()*1000)}}</div>
            <a-button size="small" @click="addIcon(item)"><Icon icon="PlusOutlined" style="color:#6e6e6e;"></Icon></a-button>
          </div>
        </div>
      </div>
      <div class="widget-list" v-if="!showStatus">
        <div class="widget-item" v-for="(item,index) in widgetList" :key="index">
          <div style="height:160px;">
            {{item.name}}
          </div>
          <div style="display:flex;justify-content: space-between">
            <div style="width:100px;"><Icon style="color:#ff0000" icon="FireFilled"></Icon>{{Number.parseInt(Math.random()*1000)}}</div>
            <a-button type="primary" size="small">添加</a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import {ref,toRef, defineExpose, reactive, defineEmits} from "vue";
import Icon from '@/components/icon'
import iconDefaultData from "@/assets/json/navJsonData.json";
import {message} from "ant-design-vue";
import iconData from "@/assets/json/iconData.json";
import {useI18n} from "vue-i18n";

const { t,locale} = useI18n()
const visible = ref(false)
const showModal=()=>{
  visible.value = true
  init()
}
const showStatus = ref(true)
const widgetList = reactive([])
const iconList = reactive([])
const sectionList = reactive([])
const currentSection = reactive({
  name: "",
  index: 0
})
const init =()=> {
  let iconData = require('@/assets/json/iconData.json');
  if(iconData){
    for(let item of iconData){
      for(let it of item.children) {
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
defineExpose({
  showModal
})
const emits = defineEmits(["addIcon"])
</script>
<style lang="less" scoped>
.app-store-nav {
  display: flex;
  justify-content: flex-start;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left:7px;
}
.app-store-nav-item {
  width: 80px;
  background: #ffffff;
  text-align: center;
  line-height: 32px;
  border-radius: 16px;
  margin-right:10px;
}
.app-store-nav-section{
  line-height: 32px;
  width: 120px;
  border-radius: 16px;
}
.app-store-nav-item-selected{
  background: #46a6ff;color:#ffffff;
}
.app-store-nav-title{
  line-height: 32px;
  margin-left:130px;
  font-size:16px;
}
.app-store-nav-input{
  width:200px;
  margin-left:190px;
  border-radius:16px;
}
.widget-list{
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  height:600px;
  overflow-y:auto;
  padding-left:7px;
}
.widget-item{
  background:#ffffff;
  width: 210px;
  height: 200px;
  margin:8px;
  padding:10px;
  border-radius: 10px;
  button{
    border-radius:12px;
  }
}
.icon-list{
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  height:600px;
  overflow-y:auto;
  padding-left:7px;
}
.icon-item{
  background:#ffffff;
  width: 162px;
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
