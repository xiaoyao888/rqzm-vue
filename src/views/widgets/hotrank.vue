<template>
  <a-modal class="aaa" v-model:visible="visible" title="热点榜单" @ok="handleOk" width="800px" :footer="null">
    <a-tabs v-model:activeKey="activeKey" @change="change" :tab-position="'left'">
      <a-tab-pane :tab="item.name" v-for="(item,itemIndex) in hotrank" :key="itemIndex">
        <ul class="rank-item" v-if="item.data.length>0" >
          <li v-for="(info,index) in item.data" :key="index">
            <div style="display: flex;flex-direction: row; justify-content: space-between">
              <a :href="info.url" target="_blank" style="white-space: nowrap;overflow:hidden;text-overflow: ellipsis;">{{info.name}}</a>
              <div v-if="info.hot && info.hot.indexOf('万')!==-1" style="margin-right:5px;">{{info.hot?info.hot.replace(' 万热度','w'):""}}</div>
              <div v-else style="margin-right:5px;">{{info.hot?(info.hot/10000).toFixed(2)+'w':""}}</div>
            </div>
          </li>
        </ul>
        <a-empty style="height:414px;" v-else/>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import {defineExpose, ref} from 'vue';
import dayjs from "dayjs";
import axios from "axios";
const activeKey = ref(0);
const visible = ref(false);
const showModal = () => {
  visible.value = true;
  initHotRank()
};
const handleOk = () => {
  visible.value = false;
};
let hotrank = [
  {
    "name":"百度",
    "data": []
  },
  {
    "name":"抖音",
    "data": []
  },
  {
    "name":"微博",
    "data": []
  },
  {
    "name":"知乎",
    "data": []
  },
  {
    "name":"哔哩哔哩",
    "data": []
  },
  {
    "name":"头条",
    "data": []
  }
]
const change =(e)=>{
  activeKey.value = e;
  initHotRank()
}
//方法
const initHotRank = () => {
  let urlList = ["baiduhot","douyinhot","weibohot","zhihuhot","bilihot","toutiaohot"]
  let url = urlList[activeKey.value]
  let hot = localStorage.getItem(url);
  if(hot){
    let h = JSON.parse(hot);
    if(dayjs().valueOf() - h.expiryTime< 1000*60*60*2 && h.data.data)
      hotrank[activeKey.value].data = h.data.data
    return;
  }
  axios.get("/tenapi/v2/"+url).then((res) => {
    if (res.status === 200 && res.data.code === 200) {
      hotrank[0].data = res.data
      let jsonStr = JSON.stringify({expiryTime: dayjs().valueOf(), data: res.data});
      localStorage.setItem(url,jsonStr);
    }
  });
}
defineExpose({
  showModal
})

</script>

<style lang="less" scoped>
:global(.ant-modal-header){
  background: none!important;
}
:global(.ant-modal-content){
  background: transparent;
  box-shadow: none!important;
}
:global(.ant-modal){
  border-radius: 20px;
  background: linear-gradient(180deg, #ffc7b7 0%, #f8e0cf 26%, #fffefd 100%)
}
.rank-item {
  height:400px;
  overflow-y: auto;
  list-style-type: demical;
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
  li {
    margin-left: -15px;
    font-size: 13px;
    text-align: left;
    line-height: 22px;
  }
}
</style>