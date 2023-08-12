<template>
	<!-- :maskStyle="{'background':'#000'}" -->
	<a-modal v-model:visible="visible" class="full-modal" width="100%" height="100vh" @cancel="exit" 
	    style="max-width: 100vw;left: 0;right: 0;top: 0;bottom: 0;background: #000;"
		:bodyStyle="{'background':'#000'}" :footer="null">
		<template #closeIcon>
			<Icon @click="exit" class="close-icon" icon="CloseOutlined" />
		</template>
		<div class="container" style="text-align: center;">
			<div class="time">{{time}}</div>
			<div class="date">
				<div>{{date}}</div>
				<div>{{ nowWeek }}</div>
				<div>{{ nowLunar }}</div>
				<span>{{nowDayOfYear}}</span>
				<span>{{nowWeekOfYear}}</span>
			</div>
		</div>
	</a-modal>
</template>

<script setup>
	import crypto from '@/utils/crypto'
	import {
		ref,
		defineExpose
	} from "vue";
	import Icon from '@/components/icon'
	import {
		useI18n
	} from "vue-i18n";
	import dayjs from 'dayjs';
	import {
		parseTime
	} from '@/utils/util'
	import {
		getLunar
	} from '@/utils/getLunar.js'

	const {
		locale
	} = useI18n()
	const dj = dayjs()
	const time = ref()
	const date = ref()
	const nowWeek = ref()
	const nowLunar = ref()
	const nowDayOfYear = ref()
	const nowWeekOfYear = ref()
	const initDate = () => {
		const dayjsDate = dj.toDate()
		date.value = dj.format("YYYY-MM-DD")
		nowWeek.value = parseTime(dayjsDate, '{a}', locale.value)
		nowLunar.value = getLunar(dayjsDate)
		let year = new Date(dayjsDate.getFullYear(), 0, 0);
		let day = parseInt((dayjsDate - year) / 24 / 60 / 60 / 1000)
		nowDayOfYear.value = "第" + day + "天"
		nowWeekOfYear.value = "第" + Math.ceil(day / 7) + "周"
	}
	initDate()
	const refreshTime = () => {
		time.value = dayjs().format("HH:mm:ss");
	}
	setInterval(refreshTime, 1000)
	const visible = ref(false)
	const isFull = ref(false)
	const full = () => {
		let de = document.documentElement
		if (de.requestFullscreen) {
			de.requestFullscreen()
		} else if (de.mozRequestFullScreen) {
			de.mozRequestFullScreen()
		} else if (de.wekitRequestFullScreen) {
			de.webkitRequestFullScreen()
		}
		isFull.value = true
	}
	const exit = () => {
		try {
		    let de = document
			if(de && de.fullscreen){
				if (de.exitFullscreen) {
					de.exitFullscreen()
				} else if (de.mozCancelFullScreen) {
					de.mozCancelFullScreen()
				} else if (de.wekitCancelFullScreen) {
					de.wekitCancelFullScreen()
				}
				isFull.value = false
			}
		} catch (e) {
		    console.log("发生异常:" + e)
		}
	}
	const cancel =()=>{
		exit()
		
	}
	const showModal = () => {
		visible.value = true
		isFull.value = true
		full()
	};
	defineExpose({
		showModal
	})
</script>

<style lang="less" scoped>
	.full-modal {
		
	}

	.close-icon {
		font-size: 30px;
		color: #525252;
		position: absolute;
		right: 10px;
		top: 10px;
	}

	.time {
		font-size: 140px;
		vertical-align: middle;
		color: #3dff0f;
		;
		line-height: 180px;
		margin-top: 9%;
	}

	.date {
		font-size: 24px;
		color: #3dff0f;
		width: 520px;
		margin: 0 auto;
		display: inline-flex;
		justify-content: space-between;
	}

	.exit {
		font-size: 30px;
		color: #525252;
		position: absolute;
		right: 55px;
		top: 10px;
	}
</style>