<template>
    <a-modal v-model:visible="visible" class="dialogWidth" width="400px" :footer="null" :header="null">
    <div class="vuex-list">
      <a-input
        ref="inputRef"
        v-model:value="inputValue"
        type="text"
        placeholder="请输入内容"
      />
      <div style="display:flex;flex-wrap: wrap;justify-content: center;flex-direction: row;">
        <div style="text-align: center;" v-for="item in translateList">
          <div class="trans-menu el-button--primary" style="padding:10px;">
            <a :href="geturl(item)" target="_blank">
            <img :src="require('@/assets/images/logos/translate/' + item.icon)" style="width:100%;height:100%;"/><br/>
            </a>
          </div>
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {ref,reactive} from "vue";

export default {
  name: 'Weather',
  setup(prop,{ expose }) {
    const data = {
      visible: ref(false),
      exportVisible: ref(false),
      defaultIndex: ref('2'),
      activeIndex: ref('2'),
      translateList: reactive([
          {
        name: "火山翻译",
        nameEn: "Volcano",
        url: "https://translate.volcengine.com/translate?from=rqzm.cn&text={0}",
        icon: "huoshan.svg"
      }, {
        name: "百度翻译",
        nameEn: "Baidu",
        url: "https://fanyi.baidu.com/#zh/en/{0}",
        icon: "baidu.svg"
      }, {
        name: "微软翻译",
        nameEn: "MS Bing",
        url: "https://cn.bing.com/translator/?h_text=msn_ctxt&setlang=zh-cn&from=rqzm.cn&text={0}",
        icon: "bing.svg"
      }, {
        name: "谷歌翻译",
        nameEn: "Google",
        url: "https://translate.google.com/",
        icon: "google.svg"
      }, {
        name: "有道翻译",
        nameEn: "Google",
        url: "https://fanyi.youdao.com/",
        icon: "youdao.svg"
      }, {
        name: "搜狗翻译",
        nameEn: "Google",
        url: "https://fanyi.sogou.com/text?keyword={0}&transfrom=auto&transto=zh-CHS&model=general",
        icon: "sougou.svg"
      }, {
        name: "腾讯翻译君",
        nameEn: "Google",
        url: "https://fanyi.qq.com/?text={0}",
        icon: "qq.svg"
      }, {
        name: "360翻译",
        nameEn: "Google",
        url: "https://fanyi.so.com/#{0}",
        icon: "360.svg"
      }, {
        name: "金山翻译",
        nameEn: "Google",
        url: "https://www.iciba.com/fy",
        icon: "iciba.svg"
      }]),
      currentList: reactive([]),
      inputValue: ref(''),
    }
    const methods = {
      geturl:(item)=>{
        return item.url.format(data.inputValue.value);
      }
    }
    const visible = data.visible
    const inputValue = data.inputValue
    expose({
      visible,
      inputValue
    })
    return {
      ...data,
      ...methods
    }
  }
}
String.prototype.format = function () {
  // 数据长度为空，则直接返回
  if (arguments.length == 0){
    return this;
  }

  // 使用正则表达式，循环替换占位符数据
  for (var result = this, i = 0; i < arguments.length; i++){
    result = result.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return result;
  }
};
</script>

<style lang="less" scoped>
.custom-el-dialog {
  margin-top: 100px;
}

:deep .el-dialog__header {
  display: none;
}

:deep .el-dialog__body {
  border-radius: 10px !important;
  //background: url("@/assets/images/wallpaper/2zrdI1g.jpg") !important;
}

.trans-menu {
  height: 90px;
  width: 90px;
  border-radius: 20px;
  background: #98e0ff;

  color: #fff;
  text-align: center;
  vertical-align: middle;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;

  div {
    font-size: 12px;
  }
}
:deep .ant-modal-close{
  display:none;
}
:deep .ant-modal-close-x {
    width: 20px !important;
    height: 20px !important;
}
</style>
