<template>
	<a-modal v-model:visible="visible" class="dialogWidth" width="50%" :title="$t('action.admiration')" :footer="null">
    <div class="support-content">
      <div class="title">
        请作者喝杯咖啡!☕️☕️
      </div>
      <p >
        我是一名个人开发者!
      </p>
      <p >
        人气桌面致力于为您提供最纯净的用户体验，且所有服务器运营费用都由我个人承担。
      </p>
      <p >
        与此同时，人气桌面若要长久健康运营下去，离不开您的支持和鼓励。如果人气桌面对您有价值，不妨支持一下我吧，我将专注于持续优化产品体验。
      </p>
      <p>如果你也想搭一套这样的系统，请+V: iherry详细咨询！</p>
      <center>
        <img src="../../assets/images/support-chat.jpg" style="border-radius: 4px;width:200px">
        <br/>
        <a-button type="primary" @click="visible = false">下次再说</a-button>
      </center>
    </div>
  </a-modal>
</template>

<script>
import {ref, expose} from 'vue'
	export default {
		name: "supportAuthor",
		setup(props, { expose }) {
			const visible = ref(false);
			const showModal = () => {
				visible.value = true;
			};
			const handleOk = e => {
				visible.value = false;
			};
			expose({
				visible,
				showModal
			})
			return {
				visible,
				showModal,
				handleOk,
			}
		},

	}
</script>

<style lang="less" scoped>
@media screen and (max-width:768px) {
  .dialogWidth{
    width:100%!important;
  }
  :deep .el-dialog{
    width:100%!important;
  }
}
.dialogWidth{
  width:100%;
}
.support-content{
  color: rgba(var(--img-text), 1);
  .title{
    font-size:20px;
    text-align: center;
  }
  p{
    text-indent: 2em;
  }
}
</style>
