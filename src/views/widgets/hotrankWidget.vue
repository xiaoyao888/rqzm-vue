<template>
  <div>
    <div class="widget" v-if="props.widgetProps.size==='2x4'" >
      <a-tabs v-model:activeKey="activeKey" @change="change">
        <a-tab-pane :tab="item.name" v-for="(item,itemIndex) in hotrank" :key="itemIndex">
          <ul class="rank-item" v-if="item.data.length>0">
            <li v-for="(info,index) in item.data" :key="index">
              <div style="display: flex;flex-direction: row; justify-content: space-between">
                <a :href="info.url" onclick="window.event.cancelBubble=true" target="_blank" style="white-space: nowrap;overflow:hidden;text-overflow: ellipsis;">{{info.name}}</a>
                <div v-if="info.hot && info.hot.indexOf('万')!==-1" style="margin-right:5px;">{{info.hot?info.hot.replace(' 万热度','w'):""}}</div>
                <div v-else style="margin-right:5px;">{{info.hot?(info.hot/10000).toFixed(2)+'w':""}}</div>
              </div>
            </li>
          </ul>
          <a-empty class="rank-item" :description="null"  v-else/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import {ref,defineProps} from "vue";
import dayjs from "dayjs";
import axios from 'axios'
const activeKey = ref(0);
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
    if(h.data.data){
      hotrank[activeKey.value].data = h.data.data.slice(0, 5)
      if(dayjs().valueOf() - h.expiryTime< 1000*60*60*2){
        return;
      }
    }
  }
  axios.get("https://tenapi.cn/v2/"+url).then((res) => {
    if (res.status === 200 && res.data.code === 200) {
      hotrank[0].data = res.data
      let jsonStr = JSON.stringify({expiryTime: dayjs().valueOf(), data: res.data});
      localStorage.setItem(url,jsonStr);
    }
  }).catch(error=>{
    console.log(error)
  });
}
initHotRank();

const props = defineProps({
  widgetProps: Object
})
</script>

<style lang="less" scoped>
:deep(.ant-tabs-top > .ant-tabs-nav, .ant-tabs-bottom > .ant-tabs-nav, .ant-tabs-top > div > .ant-tabs-nav, .ant-tabs-bottom > div > .ant-tabs-nav) {
  margin-bottom: 0 !important;
}

:deep(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap, .ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-wrap) {
  justify-content: center !important;
}

:deep(.ant-tabs-nav) {
  height: 30px;
}

:deep(.ant-tabs-tab + .ant-tabs-tab) {
  margin-left: 20px;
}

.rank-item {
  list-style-type: demical;
  li {
    margin-left: -15px;
    font-size: 12px;
    text-align: left;
    line-height: 23px;
  }
}
</style>
