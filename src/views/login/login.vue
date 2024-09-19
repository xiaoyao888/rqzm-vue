<template>
	<a-modal v-model:visible="visible" class="dialogWidth" width="300px" title="微信扫码登录" :footer="null">
		<div class="login-container">
			<img :src="loginImg" width="200" height="200" @click="initLoginImg(true)" /><br /><br />
			<a-button type="primary" @click="scan">我已扫码</a-button>
		</div>
	</a-modal>
</template>
<script>
	import crypto from "@/utils/crypto.js";
	import serviceApi from "@/api/serviceapi"
	import {
		ref
	} from "vue";
	export default {
		name: 'Login',
		setup(prop,{expose}) {
			const visible = ref(false);
			const data = {
				loginImg: ref(''),
				generateTime: ref(0),
				generateKey: ref(''),
				overtimer: ref(null)
			}
			const methods = {
				initLoginImg: (bool) => {
					if (bool && new Date().getTime() - data.generateTime.value < 300000) {
						return;
					}
					/*serviceApi.generateLoginImg({
						"var": data.generateKey.value
					}).then(res => {
						if (res.success) {
							data.loginImg.value = res.result.qrcode;
							data.generateKey.value = res.result.generateKey;
							data.generateTime.value = new Date().getTime();
						} else {
							// this.$api.msg("登录码生成失败！")
						}
					})*/
				},
				scan: () => {
					// serviceApi.isScanLogin({
					// 	"var": data.generateKey.value
					// }).then(res => {
					// 	if (res.success) {
					// 		let userInfo = JSON.stringify(res.result);
					// 		let cryptoStr = crypto.encrypt(userInfo)
					// 		localStorage.setItem("userInfo", cryptoStr);
					// 		// _this.$emit("success","");
					// 		// window.location.reload();
					// 		data.dialogVisible.value = false;
					// 	} else {
					// 		// _this.$api.msg("登录码生成失败！")
					// 	}
					// })
				},
			}
			const showModal = () => {
				visible.value = true;
			}
			let userInfo = localStorage.getItem('userInfo')
			if (!userInfo) {
				methods.initLoginImg(false);
			}
			expose({
				showModal
			})
			return {
				visible,
				...data,
				...methods,
				showModal
			}
		}
	}
</script>
<style lang="less">
	.login-container {
		min-height: 250px;
		margin-top: 10px;
		overflow: hidden;
		text-align: center;
	}
</style>