<template>
  <div ref="aiAAA">
    <a-modal v-model:visible="visible" title="AI助手" width="100%" :footer="null"
             wrap-class-name="full-modal" :getContainer="() => $refs.aiAAA" >
      <a-tabs v-model:activeKey="activeKey" @change="change" :tab-position="'left'">
        <a-tab-pane :tab="item.name" v-for="(item,itemIndex) in aiAssistantList" :key="itemIndex">
          <iframe :src="item.url" style="border-radius:10px;border:1px solid #cccccc;width:100%;height:80vh"></iframe>
        </a-tab-pane>
      </a-tabs>

    </a-modal>
  </div>
</template>

<script setup>
import {defineExpose, ref} from "vue";
const aiAssistantList = ref([
  {name: "文心一言", url: "https://yiyan.baidu.com/",desc:"百度旗下大语言模型"},
  {name: "通义千问", url: "https://tongyi.aliyun.com/qianwen/", desc:"阿里旗下大语言模型"},
  {name: "面壁露卡", url: "https://luca.cn/", desc:"知乎旗下大语言模型"},
  {name: "豆包", url: "https://www.doubao.com/", desc:"字节跳动旗下GPT类产品"},
  {name: "NewBing", url: "https://www.bing.com/new", desc:"微软旗下基于GPT的聊天机器人"},
  {name: "Moonshot AI", url: "https://www.moonshot.cn/", desc:"Kimi Chat，一个国产还不错的人工智能大模型"},
  {name: "腾讯混元", url: "https://hunyuan.tencent.com/", desc:"腾讯混元大模型是由腾讯研发"},
  {name: "日日新", url: "https://techday.sensetime.com/list", desc:"商汤旗下AI全家桶"},
  {name: "智谱清言", url: "https://chatglm.cn/", desc:"清华大学系，对话语言模型"},
  {name: "ChatGPT", url: "https://chat.openai.com/", desc:"地表最强AI聊天机器人"},
  {name: "天工", url: "https://tiangong.kunlun.com/", desc:"昆仑万维旗下类ChatGPT产品"},
  {name:"Anthropic",url:"https://www.anthropic.com/",desc:"Anthropic发布的与ChatGPT竞争的聊天机器人"},
  {name:"YOU",url:"https://you.com/",desc:"人工智能搜索聊天机器人"},
  {name:"Bard",url:"https://bard.google.com/",desc:"Google旗下类ChatGPT产品"},

])
const visible = ref(false);
const activeKey = ref(0);
const showModal = () => {
  visible.value = true;
  activeKey.value = 3;
};
const change =(e)=>{
  activeKey.value = e;
}
defineExpose({
  showModal
})
</script>

<style lang="less" scoped>

:deep(.ant-modal){
  top:5px;
}
:deep(.ant-tabs-left>.ant-tabs-nav .ant-tabs-tab+.ant-tabs-tab, .ant-tabs-left>div>.ant-tabs-nav .ant-tabs-tab+.ant-tabs-tab, .ant-tabs-right>.ant-tabs-nav .ant-tabs-tab+.ant-tabs-tab, .ant-tabs-right>div>.ant-tabs-nav .ant-tabs-tab+.ant-tabs-tab){
  margin:0;
}
:deep(.ant-tabs-left>.ant-tabs-nav .ant-tabs-tab, .ant-tabs-left>div>.ant-tabs-nav .ant-tabs-tab, .ant-tabs-right>.ant-tabs-nav .ant-tabs-tab, .ant-tabs-right>div>.ant-tabs-nav .ant-tabs-tab){
  padding:8px 6px;
}
:deep(.ant-modal-body){
  padding-top:0;
}
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>