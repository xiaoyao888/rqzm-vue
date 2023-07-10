<template>
	<a-modal v-model:visible="visible" class="dialogWidth" width="50%" :title="$t('action.privatization')" :footer="null">
		<div class="support-content">
			<div class="title">
				人气桌面私有化
			</div>
			<p>前端技术栈：Vue3、Nodejs、ant-design-vue3、axios、crypto-js</p>
			<p>后端技术栈：StringBoot、MybatisPlus、Redis、Mysql、JDK、微信SDK</p>
			<p>运维技术栈：Centos、Nginx、Shell、JDK、Maven、Nodejs、项目发布脚本</p>
			<p>如果你也想搭一套这样的系统，私有化部署前端+后端+源码+服务器部署价格仅4999元（不含服务器、域名等其它费用），请+V: iherry详细咨询！</p>
			<center>
				<a-button type="primary" @click="visible = false">考虑一下</a-button>
			</center>
		</div>
	</a-modal>
</template>

<script>
	import {ref} from 'vue'
	export default {
    // eslint-disable-next-line vue/multi-word-component-names
		name: "privatization",
		setup(props, { expose }) {
			const visible = ref(false);
			const showModal = () => {
				visible.value = true;
			};
			const handleOk = e => {
				console.log(e);
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
		.dialogWidth {
			width: 100% !important;
		}

		::v-deep .el-dialog {
			width: 100% !important;
		}
	}

	.dialogWidth {
		width: 100%;
	}

	.support-content {
		color: rgba(var(--img-text), 1);

		.title {
			font-size: 20px;
			text-align: center;
		}

		p {
			text-indent: 2em;
		}
	}
</style>