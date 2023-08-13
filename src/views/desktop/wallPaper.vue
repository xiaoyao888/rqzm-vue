<template>
  <div ref="mymodal">
    <a-modal v-model:visible="visible" class="modal" width="80%" :closable="false" :footer="null" :getContainer = '()=>$refs.mymodal'>
      <a-collapse v-model:activeKey="activeKey" accordion>
        <a-collapse-panel key="1" header="纯色壁纸">
          <div class="wallpaper-list">
            <div v-for="(item,index) in pureColorList" :key="index" :style="'background:'+item.background "
                 class="wallpaper-item" @mouseenter="currentHover = index">
              <div v-if="currentHover===index" class="wallpaper-checked-icon-container" @click="changeWallpaper(item)">
                <Icon class="wallpaper-checked-icon" icon="CheckOutlined"/>
              </div>
            </div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="必应壁纸">
          <div class="wallpaper-list">
            <div v-for="(item,index) in bingWallpaperList" :key="index" :style="'background:url('+item.thumb+')'"
                 class="wallpaper-item" @mouseenter="currentHover = index">
              <div v-if="currentHover===index" class="wallpaper-checked-icon-container" @click="changeWallpaper(item)">
                <Icon class="wallpaper-checked-icon" icon="CheckOutlined"/>
              </div>
            </div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="其他壁纸">
          <div class="wallpaper-list">
            <div v-for="(item,index) in otherWallpaperList" :key="index" :style="'background:url('+item.thumb+')'"
                 class="wallpaper-item" @mouseenter="currentHover = index">
              <div v-if="currentHover===index" class="wallpaper-checked-icon-container" @click="changeWallpaper(item)">
                <Icon class="wallpaper-checked-icon" icon="CheckOutlined" />
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-modal>
  </div>
</template>

<script setup>
import {ref,defineExpose,defineEmits} from 'vue'
import Icon from "@/components/icon"
const activeKey = ref([1]);
const currentHover = ref()
const pureColorList = require('@/assets/json/pureColor.json');
const bingWallpaperList = require('@/assets/json/bingWallpaper.json');
const otherWallpaperList = require('@/assets/json/otherWallpaper.json');

const visible = ref(false);
const showModal = () => {
  visible.value = true;
}
const changeWallpaper = (item)=>{
  localStorage.setItem("bgWallpaper",item.background)
  emits('ok',{})
}
const emits = defineEmits(['ok'])
defineExpose({
  showModal
})
</script>

<style lang="less" scoped>
div /deep/ .ant-modal-body{
  padding: 0;
}
.wallpaper-list{
  display:flex;flex-direction: row;flex-wrap: wrap;justify-content: center;height:400px;overflow-y: auto
}
.wallpaper-item{
  width:150px;height:100px;margin:5px;
}
.wallpaper-checked-icon-container{
  background:#0006;width:40px;height:40px;border-radius: 20px;margin: 0 auto;margin-top:20%;
}
.wallpaper-checked-icon{
  color:#ffffff;
  margin-top: 10px;
  font-size:18px;
}
</style>