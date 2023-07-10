<template>
	<div id="fullpage" class="fullpage " :class="themeMode"
		:style="'background: url('+background+');background-color:rgb(0,0,0,0.8);background-size:100% 100%;'">
		<!--    <full-page ref="fullpage" :options="options">-->
		<!-- style="backdrop-filter: blur(1px)" -->
		<div :id="'section'+(index+1)" class="section" :class="'section'+(index+1)"
			v-for="(item,index) in iconDefaultData" @contextmenu.prevent="openMenu($event)">
			<div class="app-grid" :style="currentIconPage === index?'':'display:none'">
				<vuedraggable class="wrapper" v-model="item.children">
					<transition-group name="flip-list" tag="div" class="transitionGroup" @drop="dropEvent($event)">
						<div v-for="(app,i) in item.children" :key="app.id" class="app-item"
							:class="'icon-size-'+(app.size?app.size:'1x1')" draggable="true"
							@dragstart="dragEnterEvent($event, app)" @dragend="dragEnterOver($event,1)">
							<div v-if="batchDeleteAppItemVisible"
								style="position: absolute;top:-7px;right:7px;z-index:1000">
								<i class="el-icon-error" style="font-size:18px;color:#ffffff;"
									@click="deleteAppItem(app,index,i,'appItem')"></i>
							</div>
							<div :id="'appItem'+app.id" :data-index="i" class="app-icon" @click="appClick(app,index,i)"
								:style="'background:'+iconBackground(app)"
								@contextmenu.prevent="openMenu($event,index,i,app)">
								<span v-if="app.type==='text'"
									:class="'widget-'+(app.size?app.size:'1x1')">{{ app.iconWord }}</span>
								<img v-else-if="app.type==='icon'" :src="getImgUrl(app)" class="icon">
								<img v-else-if="app.type==='component' && app.size==='1x1'" :src="getImgUrl(app)"
									class="icon">
								<countdown-widget v-else-if="app.type==='countdown'" :size="app.size?app.size:'1x1'"
									:form="app"></countdown-widget>
								<calendar-widget v-else-if="app.type==='calendar'"
									:size="app.size?app.size:'1x1'"></calendar-widget>
							</div>
							<div class="app-title">{{ $i18n.locale === 'zh_cn' ? app.name : app.nameEn }}</div>
						</div>
					</transition-group>
				</vuedraggable>
			</div>
		</div>
		<!--    </full-page>-->
		<div class="toolsBar">
			<div data-menu="none" :class="windmillRotate?'windmill':''" style="float:right;margin-right:10px;"
				@click="rotate()">
				<img id="windmill" data-menu="none" style="width:30px;height:30px;" src="@/assets/images/windmill.svg">
			</div>
			<div class="supportAuthor">
				<span style="cursor:pointer" @click="showDialog('supportAuthor')">{{ $t("action.admiration") }}</span>
				<span style="cursor:pointer;margin-left:10px;"
					@click="showDialog('privatization')">{{ $t("action.privatization") }}</span>
			</div>
		</div>
		<div class="leftBar">
			<div class="loginVisible" @click="showDialog('userLogin')">
				<div v-if="userInfo.nickName" class="login" @click="drawer('person')">
					<a>{{ userInfo.nickName }}</a>
				</div>
				<div v-else class="login">
					<a-tooltip placement="right">
						<template #title>
							<span>{{$t('common.login')}}</span>
						</template>
						<user-outlined />
					</a-tooltip>
				</div>
			</div>
			<div>
				
					<!-- <i class="el-icon-user-solid"></i><a @click="showDialog('userLogin')">{{ $t('common.login') }}</a> -->
				
				<div v-for="(item,index) in iconDefaultData" @click="selectDesktop(item,index)">
					<a><i :class="'el-icon-'+item.icon"></i>{{ locale === 'zh_cn' ? item.name : item.nameEn }}</a>
				</div>
			</div>
			<div class="settingVisible" @click="setting('setting')">
				<a-tooltip placement="right">
					<template #title>
						<span>{{$t('common.setting')}}</span>
					</template>
					<setting-outlined />
				</a-tooltip>
			</div>
		</div>
		<div class="search-container">
			<div class="search-box">
				<div class="search">
					<a-input-group>
						<a-select v-model="searchEngine">
							<a-select-option v-for="(item,index) in searchEngineList" :key="index"
								:label="locale ==='zh_cn'?item.name:item.nameEn"
								:value="locale ==='zh_cn'?item.name:item.nameEn">
							</a-select-option>
						</a-select>
						<a-input style="width:80%;" v-model="keyword" type="text" autocomplete="off"
							:placeholder="$t('action.pleaseInputContent')" @click="search" />
					</a-input-group>
				</div>
			</div>
			<div class="dateTime" :style="(dateTimeConfig.weight?'font-weight:bold':'')"
				@click="showDialog('calendar')">
				<span v-if="dateTimeConfig.showTime"
					:style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''">{{ nowDateTime }} </span>
				<span v-if="dateTimeConfig.week" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''">
					{{ nowWeek }}
				</span>
				<span v-if="dateTimeConfig.lunar" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''">
					{{ nowLunar }}
				</span>
			</div>
		</div>
		<ul class="contextmenu v-contextmenu section-contextmenu" id="menuhome_section" v-show="rightKeyMenuVisible"
			:style="{left:rightKeyMenuLeft+'px',top:rightKeyMenuTop+'px'}">
			<li class="contextmenu-item hover" @click="addAppItem()"><i class="el-icon-plus"></i>
				{{ $t("action.addIcon") }}
			</li>
			<li class="contextmenu-item hover" @click="showDialog('translate')">
				<i class="el-icon-refresh"></i> {{ $t("common.translate") }}
			</li>
			<li class="contextmenu-item hover" @click="rotate()"><i class="el-icon-sort"></i>
				{{ $t("action.changeWallpaper") }}</li>
			<li class="contextmenu-item hover"><i class="el-icon-download"></i> <a :href="background"
					target="_blank">{{ $t("action.downWallpaper") }}</a></li>
			<li class="contextmenu-item hover" @click="showDialog('searchIcon')">
				<i class="el-icon-search"></i> {{ $t("action.localSearch") }}
			</li>
		</ul>
		<ul class="contextmenu v-contextmenu" id="menuhome_nav_bar" v-show="navRightMenuVisible"
			:style="{left:rightKeyMenuLeft+'px',top:rightKeyMenuTop+'px'}">
			<li class="contextmenu-item hover" @click="batchDeleteNavAppItemVisible = !batchDeleteNavAppItemVisible">
				{{ batchDeleteNavAppItemVisible ? $t("common.cancelEdit") : $t("common.edit") }}
			</li>
		</ul>
		<ul class="contextmenu v-contextmenu" id="menuhome_icon" v-show="iconRightMenuVisible"
			:style="{left:rightKeyMenuLeft+'px',top:rightKeyMenuTop+'px'}">
			<li class="contextmenu-item hover" @click="moveToFirstPage()"><i class="el-icon-sort"></i>
				{{ $t("action.moveToHome") }}
			</li>
			<li class="contextmenu-item"><i class="el-icon-menu"></i> {{ $t("common.layout") }}
				<div class="contextmenu-layout">
					<em class="" @click="changeAppIconlayout('1x1')">1x1</em>
					<em class="" @click="changeAppIconlayout('1x2')">1x2</em>
					<em class="" @click="changeAppIconlayout('2x1')">2x1</em>
					<em class="" @click="changeAppIconlayout('2x2')">2x2</em>
					<em class="" @click="changeAppIconlayout('2x4')">2x4</em>
				</div>
			</li>
			<li class="contextmenu-item hover"><i class="el-icon-edit"></i>
				{{ $t("common.edit") }}
			</li>
			<li class="contextmenu-item hover" @click="batchDeleteAppItemVisible = !batchDeleteAppItemVisible">
				<i class="el-icon-delete"></i>
				{{ batchDeleteAppItemVisible ? $t("common.cancelBatchDelete") : $t("common.batchDelete") }}
			</li>
			<li class="contextmenu-item hover" @click="deleteAppItem(null,null,null,'appItem')">
				<i class="el-icon-delete"></i>
				{{ $t("common.delete") }}
			</li>
		</ul>
		<div style="position:absolute;right:10px;bottom:10px;">
			<canvas style="border-radius:60px;" ref="clock" width="120" height="120"></canvas>
		</div>
<!--		<setting ref="settingModal" @changeThemeMode="changeThemeMode" @changeDateTime="changeDateTime"-->
<!--			@changeNavBarMode="initNavbar"></setting>-->
<!--		<add-app-item ref="addAppItem" @ok="initIconList()"></add-app-item>-->
<!--		<search-icon ref="searchIcon"></search-icon>-->
<!--		<login ref="userLogin" @success="initUserInfo()"></login>-->
<!--		<todo-list ref="todoList"></todo-list>-->
<!--		<support-author ref="supportAuthor"></support-author>-->
<!--		<privatization ref="privatization"></privatization>-->
<!--		<countdown ref="countdown" @ok="initIconList()"></countdown>-->
<!--		<calendar ref="calendar"></calendar>-->
<!--		<translate ref="translate"></translate>-->
<!--		<person ref="person" :user-info="userInfo"></person>-->
		<!--    <div class="wallpaper"></div>-->
	</div>
</template>
<style lang="less">
	.windmill {
		img {
			animation: rotate 1s linear infinite;
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
<script>
	import {
		ref,
		reactive,
		onMounted,
		watch
	} from 'vue'
	import {
		vuedraggable
	} from 'vuedraggable';
	import drawClock from '@/utils/clock'
	import {
		randomNumber,
		dateFormat,
		parseTime
	} from '@/utils/util'
	// import {
	// 	getLunar
	// } from '@/utils/getLunar.js'
	// import {waves} from '@/directive/waves'
	// import setting from './setting';
	// import {person} from './person';
	// import {addAppItem} from './addAppItem';
	// import {searchIcon} from './searchIcon';
	// import login from '@/views/login/login';
	// import {todoList} from '@/views/widgets/todoList';
	// import supportAuthor from './supportAuthor';
	// import privatization from './privatization';
	// import {Countdown} from "@/views/widgets/countdown";
	// import {CountdownWidget} from "../widgets/countdownWidget";
	// import {calendar} from "@/views/widgets/calendar";
	// import {translate} from "@/views/widgets/translate";
	// import {calendarWidget} from "../widgets/calendarWidget";
	// import {themePicker} from "@/components/ThemePicker";
	// import {crypto} from "@/utils/crypto";
	import {
		useI18n
	} from "vue-i18n";
	import {
		SettingOutlined,
		UserOutlined
	} from '@ant-design/icons-vue';
	export default {
		name: "desktopIndex",
		directives: {
			// waves
		},
		components: {
			SettingOutlined,
			UserOutlined,
			// Countdown,
			// CountdownWidget,
			vuedraggable,
			// setting,
			// addAppItem,
			// searchIcon,
			// login,
			// todoList,
			// supportAuthor,
			// privatization,
			// calendar,
			// calendarWidget,
			// translate,
			// person
		},
		setup() {
			const clock = ref(null);
			const supportAuthor = ref(null);
			const privatization = ref(null);
			// const settingModal = ref(null);
			const userLogin = ref(null);
			const {
				t,
				locale
			} = useI18n()
			let defaultEngine = locale.value === 'zh_cn' ? '百度' : 'Baidu'
			let data = {
				windmillRotate: ref(false),
				drawerVisible: ref(false),
				dateTimeConfig: reactive({
					showTime: true,
					format: "yyyy-MM-dd",
					week: true,
					lunar: true,
					color: '#ffffff',
					weight: true,
					timestamp: 1000 * 60 * 60 * 24
				}),
				// background: "https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1673912402587-57ac40f1b4a5?ixid=M3w0MjI2NjN8MHwxfHRvcGljfHx4alBSNGhsa0JHQXx8fHx8Mnx8MTY4ODE5OTQyN3w&ixlib=rb-4.0.3&w=2560&h=1440&fmt=webp",
				background: ref(null),
				themeMode: ref('light'), //this.$store.state.settings.themeMode,
				themeColor: ref('#000000'), //this.$store.state.settings.themeColor,
				options: reactive({
					navigation: true,
					slidesNavigation: true,
					slidesNavPosition: 'bottom',
					css3: true,
					scrollingSpeed: 700,
				}),
				nowDateTime: ref(''),
				nowWeek: ref(''),
				nowLunar: ref(''),
				currentIconPage: ref(0),
				iconDefaultData: [],
				navAppItems: reactive([]),
				searchEngine: defaultEngine,
				searchEngineList: reactive([{
						"name": "百度",
						"nameEn": "Baidu",
						"url": "https://www.baidu.com/s?wd="
					},
					{
						"name": "Bing",
						"nameEn": "Bing",
						"url": "https://cn.bing.com/search?q="
					},
					{
						"name": "谷歌",
						"nameEn": "Google",
						"url": "https://www.google.com/search?q="
					},
					{
						"name": "Github",
						"nameEn": "Github",
						"url": "https://github.com/search?q="
					},
				]),
				keyword: ref(''),
				selectSectionAppItem: reactive({}),
				selectSectionAppItemParentIndex: ref(0),
				selectSectionAppItemIndex: ref(0),
				rightKeyMenuVisible: ref(false),
				navRightMenuVisible: ref(false),
				iconRightMenuVisible: ref(false),
				rightKeyMenuTop: ref(0),
				rightKeyMenuLeft: ref(0),
				dragNav: reactive({}),
				batchDeleteAppItemVisible: ref(false),
				batchDeleteNavAppItemVisible: ref(false),
				userInfo: reactive({
					nickName: "",
					avatarUrl: "",
					lastLoginTime: "",
					lastLoginIp: ""
				}),
				t,
				locale,
				clock,
				supportAuthor,
				privatization,
				// settingModal,
				userLogin
			}


			// themePicker.methods.themeChange(data.themeColor);

			const methods = {
				rotate: () => {
					data.windmillRotate.value = true;

					setTimeout(function() {
						data.windmillRotate.value = false;
						const bgData = require('@/assets/json/background.json'); //111
						const random = Number(randomNumber(0, 111))
						const bg = bgData[random].raw;
						data.background.value = bg;
						localStorage.setItem("background", bg);
					}, 5000);
				},
				initDateTime: () => {
					let dateTimeConfig = localStorage.getItem('dateTimeConfig')
					if (dateTimeConfig && dateTimeConfig.length > 0) {
						data.dateTimeConfig = reactive(JSON.parse(dateTimeConfig));
					} else {
						let config = data.dateTimeConfig
						localStorage.setItem("dateTimeConfig", JSON.stringify(config))
					}
					if (data.dateTimeConfig.showTime) {
						data.nowDateTime = dateFormat(data.dateTimeConfig.format, new Date());
						setInterval(function() {
							data.nowDateTime = dateFormat(data.dateTimeConfig.format, new Date())
						}, data.dateTimeConfig.timestamp)
					}
					if (data.dateTimeConfig.week) {
						let date = new Date();
						data.nowWeek = parseTime(date, '{a}')
					}
					if (data.dateTimeConfig.lunar) {
						let date = new Date();
						// data.nowLunar = getLunar(date);
					}
				},
				initIconList: () => {
					//鍒ゆ柇icon鍒楄〃鏄惁鏈夋暟鎹
					let iconDefaultData = localStorage.getItem('iconDefaultData') || []
					if (iconDefaultData) {
						if (iconDefaultData.length > 0) {
							iconDefaultData = JSON.parse(iconDefaultData);
						} else {
							iconDefaultData = require('@/assets/json/navJsonData.json');
							localStorage.setItem("iconDefaultData", JSON.stringify(iconDefaultData));
						}
						data.iconDefaultData = iconDefaultData;
					}
				},
				initUserInfo: () => {
					let userInfo = localStorage.getItem('userInfo')
					if (userInfo) {
						userInfo = crypto.decrypt(userInfo);
						this.userInfo = JSON.parse(userInfo);
					}
				},
				initNavbar: () => {
					// if(this.$store.state.settings.showNavBar){
					//   //鍒ゆ柇��艰埅鏉℃槸鍚︽湁搴旂敤鏁版嵁鏈夊垯鍔犺��
					let navAppItems = localStorage.getItem('navAppItems') || []
					if (navAppItems) {
						if (navAppItems.length > 0) {
							navAppItems = JSON.parse(navAppItems);
						}
						data.navAppItems.value = navAppItems;
					}
					// }
				},
				initWallPaper: () => {
					data.background.value = localStorage.getItem('background') || 'background.jpg'
				},
				selectDesktop: (item, index) => {
					data.currentIconPage.value = index
				},
				changeThemeMode: (mode) => {
					this.themeMode = mode;
				},
				changeDateTime: (mode) => {
					this.dateTimeConfig.showTime = mode;
				},
				showDialog: (value) => {
					if (value === 'supportAuthor') {
						supportAuthor.value.showModal();
					} else if (value === 'privatization') {
						privatization.value.showModal();
					} else if (value === 'userLogin') {
						userLogin.value.showModal(); 
					}

				},
				// setting: (value) => {
				// 	settingModal.value.showModal();
				// },
				getImgUrl: (item) => {
					if (!item.src) {
						return;
					}
					try {
						return require('@/assets/images/logos/' + item.src + "");
					} catch (e) {}
				},
				allowDrop: (event) => {
					event.preventDefault();
				},
				dragEnterEvent: (event, app) => {
					data.dragNav = app;
				},
				dragEnterOver: (event, type) => {
					data.dragNav = null;
					if (type === 1) {
						localStorage.setItem("iconDefaultData", JSON.stringify(data.iconDefaultData))
					} else {
						localStorage.setItem("navAppItems", JSON.stringify(data.navAppItems))
					}
				},
				dropEvent: (event) => {
					event.preventDefault();
					if (!data.dragNav.id) {
						return;
					}
					if (event.currentTarget.id !== 'navBar' || event.target.parentElement.id !== 'navAppItem') {
						for (let item of data.navAppItems) {
							if (item.name === data.dragNav.name && item.id === data.dragNav.id) {
								// data.$message.warning("宸插瓨鍦ㄨ搴旂敤锛)
								return;
							}
						}
					}
					data.navAppItems.push(data.dragNav);
					let navAppItems = localStorage.getItem('navAppItems') || []
					if (navAppItems) {
						if (navAppItems.length > 0) {
							navAppItems = JSON.parse(navAppItems);
						}
						navAppItems.push(data.dragNav);
					}
					localStorage.setItem("navAppItems", JSON.stringify(navAppItems))
					data.dragNav = null;
				},
				iconBackground: (app) => {
					if (app.backgroundColor) {
						return app.backgroundColor;
					} else {
						if (app.config && app.config.bgColor) {
							return app.config.bgColor;
						} else {
							return '#ffffff'
						}
					}
				},
				openMenu: (e, parentIndex, appIndex, app) => {
					data.rightKeyMenuVisible.value = false;
					data.navRightMenuVisible.value = false;
					data.iconRightMenuVisible.value = false;
					// if (e.currentTarget.id !== 'navBar' && e.currentTarget.offsetHeight - e.pageY < 300) {
					// 	data.rightKeyMenuTop.value = e.pageY - 240;
					// } else {
					// 	data.rightKeyMenuTop.value = e.pageY;
					// }
					// if (e.currentTarget.id !== 'navBar' && e.currentTarget.offsetWidth - e.pageX < 110) {
					// 	data.rightKeyMenuLeft.value = e.pageX - 120;
					// } else {
					// 	data.rightKeyMenuLeft.value = e.pageX;

					// }
					if (e.currentTarget.offsetHeight - e.pageY < 110) {
						data.rightKeyMenuTop.value = e.pageY;
					} else {
						data.rightKeyMenuTop.value = e.pageY;
					}
					if (e.currentTarget.offsetWidth - e.pageX < 110) {
						data.rightKeyMenuLeft.value = e.pageX - 120;
					} else {
						data.rightKeyMenuLeft.value = e.pageX;
					}

					// if (e.currentTarget.id === 'section') {
					data.rightKeyMenuVisible.value = true; //在这里控制右键菜单的打开
					// }
					// if (e.currentTarget.id === 'navBar') {
					// 	data.navRightMenuVisible.value = true; //在这里控制右键菜单的打开
					// 	// this.selectSectionAppItem = app;
					// 	// this.selectSectionAppItemParentIndex = index;
					// }
					if (e.currentTarget.id && e.currentTarget.id.startsWith("appItem")) {
						data.selectSectionAppItem.value = app;
						data.selectSectionAppItemParentIndex.value = parentIndex;
						data.selectSectionAppItemIndex.value = appIndex;
						data.iconRightMenuVisible.value = true; //在这里控制右键菜单的打开
						if (event && event.stopPropagation) { //W3C
							event.stopPropagation();
						}
					}
				},
				closeMenu: (e) => {
					data.rightKeyMenuVisible.value = false;
					data.navRightMenuVisible.value = false;
					data.iconRightMenuVisible.value = false;
				},
				deleteAppItem: (item, parentIndex, appIndex, type) => {
					if (type === 'navBar') {
						for (let it of data.navAppItems) {
							if (it.name === item.name && it.id === item.id) {
								data.navAppItems.splice(appIndex, 1);
								break;
							}
						}
						localStorage.setItem("navAppItems", JSON.stringify(data.navAppItems))
					} else {
						if (item === null) {
							item = data.selectSectionAppItem;
							parentIndex = data.selectSectionAppItemParentIndex;
							appIndex = data.selectSectionAppItemIndex;
						}
						for (let it of data.iconDefaultData[parentIndex].children) {
							if (it.name === item.name && it.id === item.id) {
								data.iconDefaultData[parentIndex].children.splice(appIndex, 1);
								break;
							}
						}
						localStorage.setItem("iconDefaultData", JSON.stringify(data.iconDefaultData))
					}
				},
				search: () => {
					if (data.searchEngine && data.keyword) {
						let url = '';
						for (let engine of data.searchEngineList) {
							if (engine.name === data.searchEngine) {
								url = engine.url;
								break;
							}
						}
						window.open(url + data.keyword, "_blank");
					}
				},
				appClick: (item, index, appIndex) => {
					if (item.type === 'icon' || item.type === 'text') {
						window.open(item.url, "_blank");
					} else if (item.type === 'component') {
						if (item.id === 'fb9934a62e194e67ab46102c05ee45ce') {
							// this.$refs['addAppItem'].dialogVisible = true
						}
						if (item.id === '96eb2b757ec54b35b1d2a5d6bf13311a') {
							// this.$refs['todoList'].dialogVisible = true
						}
						if (item.id === '8aa6b3c126a94b939988e184a2c10f26') {
							drawer('setting');
						}
					} else if (item.type === 'countdown') {
						// this.$refs['countdown'].dialogVisible = true;
						// this.$refs['countdown'].groupIndex = index;
						// this.$refs['countdown'].appIndex = appIndex;
						// this.$refs['countdown'].form = item;
					} else if (item.id === '134df2c360e14809b15054a0be4eb57b') {
						// this.$refs['calendar'].dialogVisible = true;
						// this.$refs['calendar'].groupIndex = index;
						// this.$refs['calendar'].appIndex = appIndex;
						// this.$refs['calendar'].form = item;
					}
				},
				moveToFirstPage: () => {
					data.iconDefaultData[0].children.push(data.selectSectionAppItem);
					data.iconDefaultData[data.selectSectionAppItemParentIndex].children.splice(data
						.selectSectionAppItemIndex, 1);
					localStorage.setItem("iconDefaultData", JSON.stringify(data.iconDefaultData));
				},
				changeAppIconlayout: (value) => {
					let parentIndex = data.selectSectionAppItemParentIndex;
					let appIndex = data.selectSectionAppItemIndex;
					data.selectSectionAppItem.size = value;
					data.iconDefaultData[parentIndex].children[appIndex].size = value;
					localStorage.setItem("iconDefaultData", JSON.stringify(data.iconDefaultData));
				},
				whiteOrBlack: () => {
					var hour = new Date().getHours()
					return hour > 6 && hour < 18 ? "#fff" : "#000"
				}
			}

			methods.initDateTime();
			methods.initIconList();
			methods.initUserInfo();
			methods.initNavbar();
			methods.initWallPaper();
			onMounted(() => {
				//
				// nextTick(() => {
				const ctx = clock.value.getContext('2d');
				drawClock(ctx)
				setInterval(function() {
					drawClock(ctx)
				}, 1000);
				//clock.Draw();
				// })
			})
			watch(data.rightKeyMenuVisible, (newValue, oldValue) => {
				console.log('值发生了变更', newValue, oldValue);
			});
			document.body.addEventListener('click', methods.closeMenu)
			return {
				...data,
				...methods
			};
		}
	}
</script>

<style lang="less">
	/* <768px */
	@media screen and (max-width: 768px) {
		.section {
			.app-grid {
				width: 100% !important;
				margin-left: 0 !important;
				overflow-y: auto;
				height: 600px;

				::-webkit-scrollbar {
					width: 20px;
				}
			}
		}
	}

	.section {
		.app-grid {
			overflow-y: auto;
			height: 600px;
			padding-top: 100px;
			width: 80%;
			margin-left: 10%;

			.wrapper {
				.transitionGroup {
					display: grid;
					grid-template-columns: repeat(auto-fill, calc(var(--item-size) + var(--item-gap-y)));
					grid-template-rows: repeat(auto-fill, calc(var(--item-size) + var(--item-gap-x)));
					grid-auto-flow: dense;
					justify-content: center;
					box-sizing: border-box;
					margin-top: 20px;

					.app-item {
						//width: calc(var(--item-size) + var(--item-gap-x));
						//height: calc(var(--item-size) + var(--item-gap-y));
						padding: 0 calc(var(--item-gap-y) / 2) calc(var(--item-gap-x));
						position: relative;
						box-sizing: border-box;
						cursor: pointer;

						.app-icon {
							position: relative;
							width: 100%;
							height: 100%;
							overflow: hidden;
							border-radius: var(--icon-bg-radius);
							background-color: #fff;
							text-align: center;
							font-size: 18px;

							img {
								position: absolute;
								width: 100%;
								height: 100%;
								transform: translate3d(-50%, -50%, 0);
								top: 50%;
								left: 50%
							}
						}

						.app-icon:hover {
							//margin-top:-5px;
							//margin-left:-5px;
							//height:65px;
							//width:65px;
							//width:calc(var(--icon-size) + 5);
							//height:calc(var(--icon-size) + 5);
						}

						.app-title {
							font-size: 12px;
							color: #ffffff;
							text-align: center;
							padding-top: 10px;
							white-space: nowrap;
							overflow: hidden;
							//text-overflow: ellipsis
						}
					}
				}
			}
		}
	}

	.fullpage {
		//background-color: rgb(189, 211, 186);
		// background: url("../../../static/images/wallpaper/2zrdI1g.jpg");
		-moz-background-size: 100% 100%;
		background-size: 100% 100%;
		height: 100vh;
	}

	/*.section1 .secction1-content {
  color: #fff;
  text-align: center;
  position: absolute;
  //top: 40%;
  right: 0;
  left: 0;
}

.secction1-content h1 {
  font-size: 40px;
  padding-bottom: 30px;
}

.secction1-content p {
  font-size: 20px;
}

.section2 {
  //background-color: rgb(44, 48, 43);
  background: url("../../../static/images/wallpaper/168600.png");
}

.section3 {
  //background-color: rgb(116, 104, 109);
  background: url("../../../static/images/wallpaper/168032.webp");
}

.section4 {
  //background-color: rgb(201, 202, 157);
  background: url("../../../static/images/wallpaper/168502.webp");
}

.section5 {
  //background-color: rgb(201, 202, 157);
  background: url("../../../static/images/wallpaper/168924.webp");
}*/

	@media screen and (max-width: 768px) {
		.navMenu {
			display: none !important;
		}
	}

	.nav-bar {
		transition: .1s;
		text-align: center;
		color: rgba(var(--img-text), .6);
		font-size: 12px;
		display: flex;
		backdrop-filter: blur(4px);
		background-color: rgba(var(--alpha-bg), var(--sidebar-opacity, .5));
		height: 80px;
		width: 96%;
		margin-left: 2%;
		padding: 10px;
		position: absolute;
		bottom: 10px;
		border-radius: 10px;
		flex-direction: column;
		justify-content: center;
	}

	.nav-app-item {
		position: relative;
		box-sizing: border-box;
		cursor: pointer;
		margin-right: 10px;
		width: 55px;
		height: 55px;

		.app-icon {
			position: relative;
			width: 100%;
			height: 100%;
			overflow: hidden;
			border-radius: var(--icon-bg-radius);
			background-color: #fff;

			img {
				position: absolute;
				width: 100%;
				height: 100%;
				transform: translate3d(-50%, -50%, 0);
				top: 50%;
				left: 50%
			}
		}

		.app-icon:hover {
			margin-top: -5px;
			margin-left: -5px;
			height: 65px;
			width: 65px;
		}
	}

	/* <768px */
	@media screen and (max-width: 768px) {
		.search-container {
			width: 100% !important;
			left: 0;
			margin-left: -50% !important;

		}
	}

	.search-container {
		text-align: center;
		justify-content: center;
		height: 50px;
		position: absolute;
		top: 10px;
		left: 50%;
		width: 500px;
		margin-left: -250px;

		.search-box {
			margin: 0 auto;
			padding: 10px;
			box-sizing: border-box;

			.search {
				background-color: rgba(255, 255, 255, .6);
				border-radius: 45px;
				box-shadow: 0 0 10px 3px #0000001a;
				position: relative;
				z-index: 1;
				backdrop-filter: blur(8px);
				overflow: hidden;
				display: flex;
				height: 50px;
				//background-color: #fff;
				align-items: center;
				transition: .2s;

				.ant-select {
					width: 70px;
				}

				//color: var(--d-main);
				.ant-select:not(.ant-select-customize-input) .ant-select-selector {
					background-color: transparent;
					//border: 1px solid #d4d4d8;
					border: none;
					cursor: pointer
				}

				.ant-input-search .ant-input:hover,
				.ant-input-search .ant-input:focus {

					border: none;
				}

				.ant-input {
					background-color: transparent;
					color: var(--bg-body);
					border: none;
				}

				.ant-btn:hover,
				.ant-btn:focus,
				.ant-btn:active {
					border-top-left-radius: 25px;
					border-bottom-left-radius: 25px;
					background-color: transparent !important;
					color: var(--bg-body);
					cursor: pointer;
					border: none;
				}

				.el-select .el-input .el-input__inner {
					width: 100px
				}

				.ant-btn:hover,
				.ant-btn:focus {
					border: none;
				}

				.el-input-group--append .el-input__inner {
					border: none;
				}
			}
		}
	}


	.time-container {
		width: 320px;
		left: 50%;
		margin-left: -160px;
		text-align: center;
		color: var(--bg-body);
		height: 140px;
		position: absolute;
		bottom: 80%;

		.time {
			font-size: 80px;
			font-weight: 700
		}

		.day-box {
			padding-top: 10px;
			font-size: 18px;
			justify-content: center;

			span {
				margin: 0 6px;
			}
		}


	}

	.contextmenu {
		margin: 0;
		//background-color: #0b0b0bcc;
		color: rgba(var(--img-text), 1);
		background-color: rgba(var(--alpha-bg), .9);
		z-index: 3000;
		position: absolute;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		//color: #ffffff;
		box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

	}

	.section-contextmenu {
		width: 100px;
	}

	.section-contextmenu li {
		margin-lefts: 10px;
	}

	.contextmenu li {
		margin: 0;
		padding: 5px 5px 0px 10px;
		cursor: pointer;

		.contextmenu-layout {
			width: 105px;
			background-color: rgba(var(--alpha-bg), .9);
		}

		.contextmenu-layout em {
			display: inline-block;
			font-size: 12px;
			height: 14px;
			line-height: 14px;
			width: 36px;

			background-color: rgba(var(--alpha-bg), .6);
			//background-color: #ffffff1a;
			border-radius: 12px;
			text-align: center;
			margin: 4px;
			cursor: pointer;
			transition: background-color .25s;
		}

		em:hover {
			background-color: rgba(234, 233, 233, 0.1);
		}

		em .active {
			background-color: rgba(211, 210, 210, 0.1);
		}
	}

	.contextmenu li:hover {
		//background-color: #ffffff1a;
		background-color: rgba(var(--bg-hover), .6);
	}

	.d-icon {
		--color: inherit;
		height: 1em;
		width: 1em;
		line-height: 1em;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		fill: currentColor;
		color: var(--color);
		font-size: inherit;
	}

	.leftBar {
		transition: .1s;
		text-align: center;
		color: rgba(var(--img-text), .9);
		font-size: 12px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		backdrop-filter: blur(4px);
		background-color: rgba(var(--alpha-bg), .6);
		height: 100%;
		width: 60px;
		line-height: 40px;
		position: absolute;
		top: 0px;
	}

	.settingVisible {
		position: absolute;
		bottom: 10px;
		text-align: center;
		font-size: 18px;
		left: 0;
		right: 0;
	}

	.settingVisible:hover {
		color: #fff;
		font-size: 20px;
	}

	.loginVisible {
		position: absolute;
		top: 10px;
		text-align: center;
		font-size: 18px;
		left: 0;
		right: 0;
	}

	.loginVisible:hover {
		color: #fff;
		font-size: 20px;
	}


	.toolsBar {
		transition: .1s;
		//text-align: center;
		//font-size: 12px;
		//display: flex;
		//flex-direction: column;
		justify-content: center;
		height: 40px;
		width: 100%;
		line-height: 40px;
		position: absolute;
		top: 0px;

		.login {
			font-size: 14px;
			float: left;
			cursor: pointer;
			margin-left: 20px;
		}

		.supportAuthor {
			float: right;
			margin-right: 15px;

			span {
				line-height: 30px;
				display: inline-block;
				background-color: rgba(var(--alpha-bg), 0.6);
				padding: 0 10px;
				border-radius: 15px;
			}

			span:hover {
				background-color: rgba(var(--alpha-bg), 0.8);
			}
		}




	}

	.dateTime {
		margin-right: 15px;

		span {
			font-size: 14px;
			margin-right: 10px;
		}
	}

	.navMenu {
		font-size: 14px;
		list-style: none;
		display: flex;
		flex-direction: column;
		width: 40px;
		margin-left: 5px;

		div {
			cursor: pointer;
			margin-right: 10px;
			height: 38px;
			padding: 0 10px;
			border-radius: 8px;
		}

		div:hover {
			background: rgba(var(--bg-body), .3);
		}
	}

	//.appTextIcon {
	//  height: 55px;
	//  width: 55px;
	//  text-align: center;
	//  line-height: 55px;
	//  border-radius: 15px;
	//  color: #fff;
	//  font-size: 16px;
	//  //margin-left: 12px;
	//}


	.wallpaper {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		transition: background-image .3s, background-color .2s, transform .3s;
		background-size: cover;
		background-position: 50%;
		z-index: -100;
	}

	.wallpaper.change {
		transform: scale(1.1)
	}

	.wallpaper:after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		backdrop-filter: blur(15px);
		//background-color:rgba(0,0,0,var(--wall-mask));
	}

	.wallpaper .wallpaper-video {
		position: relative;
		height: 100%;
		width: 100%;
		object-fit: cover;
		transition: .3s;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
	}
</style>