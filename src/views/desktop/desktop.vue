<template>
  <div id="fullpage" class="fullpage " :class="themeMode" :style="bgWallpaper" @contextmenu.prevent="openMenu($event)">
    <a-layout style="height:100vh">
      <a-layout-header style="height:125px;">
        <div class="toolsBar">
          <div data-menu="none" :class="windmillRotate?'windmill':''" style="float:right;margin-right:10px;cursor: pointer"
               @click="rotate()">
            <img id="windmill" data-menu="none" style="width:30px;height:30px;" src="@/assets/images/windmill.svg">
          </div>
          <div class="supportAuthor">
            <div @click="showDialog('supportAuthor')"><Icon class="icon" icon="WalletOutlined"/>{{ $t("action.admiration") }}</div>
            <div @click="showDialog('privatization')"><Icon class="icon" icon="CommentOutlined"/>{{ $t("action.privatization") }}</div>
            <div @click="showDialog('setting')">
              <Icon class="icon" icon="SettingOutlined"/>{{ $t('common.setting') }}
            </div>
            <div @click="showDialog('userLogin')">
              <span v-if="userInfo.nickName" @click="drawer('person')">
                <a>{{ userInfo.nickName }}</a>
              </span>
              <span v-else>
                <Icon class="icon" icon="UserOutlined"/>
                <span>{{ $t('common.login') }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="search-container">
          <div class="search-box">
            <div class="search">
              <a-select v-model:value="searchEngine" style="width:30%;"
                        @change="changeSearchEngine">
                <a-select-option v-for="(item,index) in searchEngineList" :key="index"
                                 :label="locale ==='zh_cn'?item.name:item.nameEn"
                                 :value="locale ==='zh_cn'?item.name:item.nameEn">
                </a-select-option>
              </a-select>
              <a-input style="width:63%;" v-model:value="keyword" type="text" autocomplete="off"
                       :placeholder="$t('action.pleaseInputContent')" @keyup.enter="search"/>
              <Icon v-if="keyword!=null && keyword!==''" class="icon" icon="CloseOutlined" @click="keyword = ''"/>
            </div>
            <div v-if="keyword!=null && keyword!==''" style="position: absolute;top: 69px;">
              <div class="translate">
                <a :href="getTranslateUrl(item)" target="_blank" v-for="item in translateList"
                   :key="item.name">{{ item.name }}</a>
              </div>
            </div>
          </div>
          <div class="dateTime" :style="(dateTimeConfig.weight?'font-weight:bold':'')" @click="showDialog('calendar')">
            <span v-if="dateTimeConfig.showTime" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''"
                  @click="nightClockWidgetModal.showModal()">{{ nowDateTime }} </span>
                <span v-if="dateTimeConfig.week" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''">
              {{ nowWeek }}
            </span>
                <span v-if="dateTimeConfig.lunar" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''">
              {{ nowLunar }}
            </span>
                <span v-if="dateTimeConfig.day" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''">
              {{ currentDay }}
            </span>
          </div>
          <div style="clear:both"></div>
        </div>
      </a-layout-header>
      <a-layout-content >
        <swiper class="mySwiper" :class="swpierDragIsEnable === 1?'swiper-no-swiping':''" :modules="modules" :rewind="true"
            :mousewheel="true" :keyboard="true"
            :space-between="50"
            :pagination="pagination"
            @swiper="onSwiper"
            @slideChange="onSlideChange">
          <swiper-slide v-for="(item,index) in iconDefaultData.value" v-bind:key="index" @contextmenu.prevent="openMenu($event)">
            <div class="app-grid">
              <draggable class="wrapper" v-model="item.children" @mouseover="swpierDragIsEnable=1"
                         @mouseleave="swpierDragIsEnable=0" @start.prevent="dragEnterEvent" @end.prevent="dragEnterOver"
                         item-key="index">
                <template #item="{ element }">
                  <div class="item" :class="'icon-size-'+(element.size?element.size:'1x1')">
                    <div v-if="batchDeleteAppItemVisible"
                         style="position: absolute;top:-7px;right:10px;z-index:1000">
                      <Icon icon="CloseCircleFilled" style="font-size:18px;color:#ffffff;"
                            @click="batchDeleteAppItem(element)"/>
                    </div>
                    <div :id="'appItem'+element.id" :data-index="element.id" class="app-icon"
                         @click="appClick(element,index,i)" :style="'background:'+iconBackground(element)"
                         @contextmenu.prevent="openMenu($event,index,element)">
                    <span v-if="element.type==='text'"
                          :class="'widget-'+(element.size?element.size:'1x1')">{{ element.iconWord }}</span>
                      <img v-else-if="element.type==='icon'" :src="getImgUrl(element)" class="icon"
                           :class="'img-'+(element.size?element.size:'1x1')">
                      <img v-else-if="element.type==='component' && element.component==='icon'"
                           :src="getImgUrl(element)" class="icon" :class="'img-'+(element.size?element.size:'1x1')">
                      <countdown-widget v-else-if="element.component==='countdown'||element.component==='countdownTime'"
                          :size="element.size?element.size:'1x1'" :form="element"></countdown-widget>
                      <calendar-widget v-else-if="element.component==='calendar'"
                                       :size="element.size?element.size:'1x1'"></calendar-widget>
                      <today-english-widget v-else-if="element.component==='todayEnglish'"
                                            :size="element.size?element.size:'1x1'"/>
                      <today-sentence-widget v-else-if="element.component==='todaySentence'"
                                             :size="element.size?element.size:'1x1'"/>
                      <today-poetry-widget v-else-if="element.component==='todayPoetry'"
                                           :size="element.size?element.size:'1x1'"/>
                      <hotrank-widget v-else-if="element.component==='hotRank'" :widgetProps="element"/>
                    </div>
                    <div class="app-title">{{ $i18n.locale === 'zh_cn' ? element.name : element.nameEn }}</div>
                  </div>
                </template>
              </draggable>
            </div>
          </swiper-slide>
        </swiper>
      </a-layout-content>
    </a-layout>
    <!--图标应用右键菜单-->
    <ul class="contextmenu" id="menuhome_section" v-show="rightKeyMenuVisible"
        :style="{left:rightKeyMenuLeft+'px',top:rightKeyMenuTop+'px'}">
      <li class="contextmenu-item hover" @click="addAppItemModal.showModal()">
        <Icon class="icon" icon="PlusCircleOutlined"/>
        {{ $t("action.addIcon") }}
      </li>
      <li class="contextmenu-item hover" @click="changeWallpaper()">
        <Icon class="icon" icon="SlackOutlined"/>
        {{ $t("action.changeWallpaper") }}
      </li>
      <li v-if="bgWallpaper.indexOf('http')===0" class="contextmenu-item hover"><a :href="bgWallpaper.indexOf('http')===0?bgWallpaper:'#'" target="_blank">
        <Icon class="icon" icon="DownloadOutlined"/>
        {{ $t("action.downWallpaper") }}
      </a>
      </li>
      <li class="contextmenu-item hover" @click="showDialog('searchIcon')">
        <Icon class="icon" icon="SearchOutlined"/>
        {{ $t("action.localSearch") }}
      </li>
    </ul>
    <ul class="contextmenu" id="menuhome_icon" v-show="iconRightMenuVisible"
        :style="{left:rightKeyMenuLeft+'px',top:rightKeyMenuTop+'px'}">
      <li class="contextmenu-item hover">
        <Icon icon="SwapOutlined"/>
        {{ $t("action.moveTo") }}
        <div class="contextmenu-layout">
          <em v-for="(item,index) in iconDefaultData.value" :key="index" @click="moveToFirstPage(index)">
            {{ locale === 'zh_cn' ? item.name : item.nameEn }}
          </em>
        </div>
      </li>
      <li class="contextmenu-item" v-if="isDisableItem()">
        <Icon icon="LayoutOutlined"/>
        {{ $t("common.layout")  }}
        <div class="contextmenu-layout">
          <em class="" @click="changeAppIconlayout('1x1')">1x1</em>
          <em v-if="selectSectionAppItem.type!=='icon'" class="" @click="changeAppIconlayout('1x2')">1x2</em>
          <em v-if="selectSectionAppItem.type!=='icon'" class="" @click="changeAppIconlayout('2x1')">2x1</em>
          <em class="" @click="changeAppIconlayout('2x2')">2x2</em>
          <em v-if="selectSectionAppItem.type!=='icon' && selectSectionAppItem.component!=='countdown' " class=""
              @click="changeAppIconlayout('2x4')">2x4</em>
        </div>
      </li>
      <li class="contextmenu-item hover" v-if="isDisableItem()">
        <Icon icon="EditOutlined"/>
        {{ $t("common.edit") }}
      </li>
      <li class="contextmenu-item hover" v-if="isDisableItem()"
          @click="batchDeleteAppItemVisible = !batchDeleteAppItemVisible">
        <Icon icon="DeleteOutlined"/>
        {{ batchDeleteAppItemVisible ? $t("common.cancelBatchDelete") : $t("common.batchDelete") }}
      </li>
      <li class="contextmenu-item hover" v-if="isDisableItem()" @click="deleteAppItem()">
        <i class="el-icon-delete"></i>
        <Icon icon="DeleteOutlined"/>
        {{ $t("common.delete") }}
      </li>
    </ul>
    <div style="position:absolute;right:10px;bottom:10px;" v-show="clockOption.showClock">
      <canvas style="border-radius:60px;" ref="clock" :width="clockOption.width" :height="clockOption.height"></canvas>
    </div>
    <setting ref="settingModal" @changeThemeMode="changeThemeMode" @changeDateTime="changeDateTime"
             @changeClock="initClock" ></setting>
    <add-app-item ref="addAppItemModal" @ok="initIconList()"></add-app-item>
    <!--		<search-icon ref="searchIcon"></search-icon>-->
    <login ref="userLoginModal" @success="initUserInfo()"></login>
    <todo-list ref="todoListModal"></todo-list>
    <support-author ref="supportAuthorModal"></support-author>
    <privatization ref="privatizationModal"></privatization>
    <countdown ref="countdownModal" @ok="initIconList()"></countdown>
    <calendar ref="calendarModal"></calendar>
    <app-store ref="appStoreModal" @addIcon="addIcon"></app-store>
    <night-clock-widget ref="nightClockWidgetModal"/>
    <wall-paper ref="wallpaperModal" @ok="initWallPaper"></wall-paper>
    <today-poetry ref="todayPoetryModal"></today-poetry>
    <hotrank ref="hotRankModal"></hotrank>
    <ai-assistant ref="aiModal"></ai-assistant>
    <!--		<person ref="person" :user-info="userInfo"></person>-->
  </div>
</template>
<script setup>
import {
  ref,
  reactive,
  onMounted,
  defineComponent
} from 'vue'
import { Keyboard, Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import draggable from 'vuedraggable'
import drawClock from '@/utils/clock'
import {
  randomNumber,
  dateFormat,
  parseTime,
  strFormat
} from '@/utils/util'
import {getLunar} from '@/utils/getLunar.js'
// import {waves} from '@/directive/waves'
import setting from './setting';
// import person from './person';
import addAppItem from '@/views/desktop/addAppItem';
// import searchIcon from './searchIcon';
import login from '@/views/login/login';
import todoList from '@/views/widgets/todoList';
import supportAuthor from './supportAuthor';
import privatization from './privatization';
import countdown from "@/views/widgets/countdown";
import countdownWidget from "@/views/widgets/countdownWidget";
import calendar from "@/views/widgets/calendar";
import calendarWidget from "@/views/widgets/calendarWidget";
import AppStore from "@/views/widgets/appStore";
import todayEnglishWidget from "@/views/widgets/todayEnglishWidget";
import todaySentenceWidget from "@/views/widgets/todaySentenceWidget";
import TodayPoetry from "@/views/widgets/todayPoetry";
import todayPoetryWidget from "@/views/widgets/todayPoetryWidget";
import nightClockWidget from "@/views/widgets/nightClockWidget";
import Hotrank from "@/views/widgets/hotrank";
import HotrankWidget from "@/views/widgets/hotrankWidget";
import AiAssistant from "@/views/widgets/aiAssistant";
import wallPaper from "@/views/desktop/wallPaper";

// import themePicker from "@/components/ThemePicker";
// import crypto from "@/utils/crypto";
import {useI18n} from "vue-i18n";
import Icon from "@/components/icon"
import {Modal, message} from "ant-design-vue";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/keyboard'
import 'swiper/css/mousewheel'
import 'swiper/css/pagination';

defineComponent({
  Swiper,
  SwiperSlide
})

const nightClockWidgetModal = ref(null)
const clock = ref(null)
const supportAuthorModal = ref(null)
const privatizationModal = ref(null)
const settingModal = ref(null)
const userLoginModal = ref(null)
const calendarModal = ref(null)
const countdownModal = ref(null)
const appStoreModal = ref(null)
const addAppItemModal = ref(null)
const todoListModal = ref(null)
const wallpaperModal = ref(null)
const todayPoetryModal = ref(null)
const hotRankModal = ref(null)
const aiModal = ref(null)

const clockOption = reactive({
  showClock: false,
  width: 120,
  height: 120,
  shadow: {//阴影
    color: "#ccc",//颜色
    offsetX: 5,//偏移量
    offsetY: 5,
    blur: 10//模糊度
  },
  size: 400,//时钟的尺寸
  handHeaderLen: 10,//时针、分针、秒针的针头长度
  secondHandLen: 120,//秒针长度
  minuteHandLen: 100,//分针长度
  hourHandLen: 70,//时针长度
  hours: [],//若为空数组，则不显示表盘的数字，默认阿拉伯数字
  hourFontSize: 18,//数字字体大小
  hourFontColor: "brown"//显示的数字颜色
})
const {t, locale} = useI18n()
const keyword = ref('')
const windmillRotate = ref(false)
const drawerVisible = ref(false)
const dateTimeConfig = reactive({
  showTime: true,
  format: "yyyy-MM-dd",
  week: true,
  lunar: true,
  color: '#ffffff',
  weight: true,
  timestamp: 1000 * 60 * 60 * 24,
  day: true,
})
// background: "https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1673912402587-57ac40f1b4a5?ixid=M3w0MjI2NjN8MHwxfHRvcGljfHx4alBSNGhsa0JHQXx8fHx8Mnx8MTY4ODE5OTQyN3w&ixlib=rb-4.0.3&w=2560&h=1440&fmt=webp",
const bgWallpaper = ref(null)
const themeMode = ref('light') //this.$store.state.settings.themeMode,
const themeColor = ref('#000000') //this.$store.state.settings.themeColor,
const options = reactive({
  navigation: true,
  slidesNavigation: true,
  slidesNavPosition: 'bottom',
  css3: true,
  scrollingSpeed: 700,
})
const nowDateTime = ref('')
const nowWeek = ref('')
const nowLunar = ref('')
const currentDay = ref('')
const currentIconPage = ref(0)
const iconDefaultData = reactive([])
const searchEngine = ref('')
const searchEngineList = reactive(require('@/assets/json/searchEngineData.json'))
const translateList = reactive(require('@/assets/json/translate.json'))
const selectSectionAppItem = ref({})
const selectSectionAppItemSectionIndex = ref(0)
const selectSectionAppItemIndex = ref(0)
const rightKeyMenuVisible = ref(false)
const iconRightMenuVisible = ref(false)
const rightKeyMenuTop = ref(0)
const rightKeyMenuLeft = ref(0)
const dragNav = reactive({})
let batchDeleteAppItemVisible = ref(false)
const userInfo = reactive({
  nickName: "",
  avatarUrl: "",
  lastLoginTime: "",
  lastLoginIp: ""
})

const swpierDragIsEnable = ref(0)

// themePicker.themeChange(data.themeColor);

let timer = null
const modules = [Keyboard,Mousewheel,Pagination]
const pagination = {
  clickable: true,
  renderBullet: function (index, className) {
    let item = iconDefaultData.value[index];
    let name = locale.value === 'zh_cn' ? item.name : item.nameEn
    return '<span class="' + className + '">' + name + '</span>';
  },
}




const onSwiper = (swiper) => {
  // console.log(swiper);
};
const onSlideChange = () => {
  // console.log('slide change');
};


const isDisableItem = () => {
  if (selectSectionAppItem.value) {
    if (selectSectionAppItem.value.id === 'da0ebd0b0f2142c723f3s37df80d3241' ||
        selectSectionAppItem.value.id === 'fb9934a62e194e67ab46102c05ee45ce' ||
        selectSectionAppItem.value.id === '8aa6b3c126a94b939988e184a2c10f26') {
      return false
    }
  }
  return true
}
const getTranslateUrl = (item) => {
  return strFormat(item.url, [keyword.value]);
}
const addIcon = (item) => {
  iconDefaultData.value[item.index].children.push(item.app);
}
const rotate = () => {
  windmillRotate.value = true;

  setTimeout(function () {
    windmillRotate.value = false;
    const bgData = require('@/assets/json/otherWallpaper.json');
    const random = Number(randomNumber(0, 111))
    const bg = bgData[random].raw;
    bgWallpaper.value = bg;
    localStorage.setItem("bgWallpaper", bg);
    initWallPaper();
  }, 3000);
}
let dateTimeTimer = null
const initDateTime = () => {
  if(dateTimeTimer!==null){
    clearInterval(dateTimeTimer)
  }
  let dateTimeConfiguration = localStorage.getItem('dateTimeConfig')
  if (dateTimeConfiguration && dateTimeConfiguration.length > 0) {
    dateTimeConfiguration = JSON.parse(dateTimeConfiguration);
    dateTimeConfig.showTime = dateTimeConfiguration.showTime
    dateTimeConfig.format = dateTimeConfiguration.format
    dateTimeConfig.color = dateTimeConfiguration.color
    dateTimeConfig.timestamp = dateTimeConfiguration.timestamp
    dateTimeConfig.week = dateTimeConfiguration.week
    dateTimeConfig.weight = dateTimeConfiguration.weight
    dateTimeConfig.lunar = dateTimeConfiguration.lunar
    dateTimeConfig.day = dateTimeConfiguration.day
  } else {
    localStorage.setItem("dateTimeConfig", JSON.stringify(dateTimeConfig))
  }
  let date = new Date()
  if (dateTimeConfig.showTime) {
    nowDateTime.value = dateFormat(dateTimeConfig.format, new Date());
    dateTimeTimer = setInterval(function () {
      nowDateTime.value = dateFormat(dateTimeConfig.format, new Date())
    }, dateTimeConfig.timestamp)
  }
  if (dateTimeConfig.week) {
    nowWeek.value = parseTime(date, '{a}', locale.value)
  }
  if (dateTimeConfig.lunar) {
    nowLunar.value = getLunar(date);
  }
  if (dateTimeConfig.day) {
    let year = new Date(date.getFullYear(), 0, 0);
    let day = parseInt((date - year) / 24 / 60 / 60 / 1000)
    currentDay.value = "第" + day + "天  第" + Math.ceil(day / 7) + "周"
  }
}
const initIconList = () => {
  let defaultData = localStorage.getItem('iconDefaultData') || []
  if (defaultData) {
    if (defaultData.length > 0) {
      defaultData = JSON.parse(defaultData);
    } else {
      defaultData = require('@/assets/json/navJsonData.json');
      localStorage.setItem("iconDefaultData", JSON.stringify(defaultData));
    }
    iconDefaultData.value = defaultData;
  }
}
const initUserInfo = () => {
  let user = localStorage.getItem('userInfo')
  if (user) {
    userInfo.value = JSON.parse(crypto.decrypt(user));
  }
}
const initWallPaper = () => {
  let wallpaper = localStorage.getItem('bgWallpaper')
  if (wallpaper && wallpaper.length > 0) {
    if (wallpaper && wallpaper.indexOf('http') === 0) {
      bgWallpaper.value = 'background: url(' + wallpaper + ') no-repeat center center;' +
          'background-color:rgb(0,0,0,0.5);background-position-x:center;background-position-y:center;'
    } else if (wallpaper && wallpaper.indexOf('/img/') === 0) {
      bgWallpaper.value = 'background: url(' + wallpaper + ') no-repeat center center;' +
          'background-color:rgb(0,0,0,0.5);background-position-x:center;background-position-y:center;'
    } else {
      bgWallpaper.value = 'background:' + wallpaper
    }
  } else {
    let bg = getBackgroundImgUrl('background.jpg');
    localStorage.setItem("bgWallpaper", bg)
    bgWallpaper.value = 'background: url(' + bg + ');background-color:rgb(0,0,0,0.5);background-size:100% 100%;'
  }
}
const changeThemeMode = (mode) => {
  themeMode.value = mode;
}
const changeDateTime = () => {
  initDateTime()
}
const changeWallpaper = () => {
  wallpaperModal.value.showModal()
}
const showDialog = (value) => {
  if (value === 'supportAuthor') {
    supportAuthorModal.value.showModal();
  } else if (value === 'privatization') {
    privatizationModal.value.showModal();
  } else if (value === 'userLogin') {
    userLoginModal.value.showModal();
  } else if (value === 'setting') {
    settingModal.value.visible = true;
  }
}
const getImgUrl = (item) => {
  if (!item.src) {
    return;
  }
  if (item.src.indexOf("http") !== -1) {
    return item.src
  } else {
    try {
      return require('@/assets/images/logos/' + item.src + "");
    } catch (e) {
    }
  }
}
const getBackgroundImgUrl = (image) => {
  return require('@/assets/images/wallpaper/' + image);
}
const allowDrop = (event) => {
  event.preventDefault();
}
const dragEnterEvent = (event) => {
  dragNav.value = event.item;
}
const dragEnterOver = (event) => {
  dragNav.value = null;
  localStorage.setItem("iconDefaultData", JSON.stringify(iconDefaultData.value))
}
const dropEvent = (event) => {
  event.preventDefault();
  if (!dragNav.id) {
    return;
  }
}
const iconBackground = (app) => {
  if (app.backgroundColor) {
    return app.backgroundColor;
  } else {
    if (app.config && app.config.bgColor) {
      return app.config.bgColor;
    } else {
      return '#ffffff'
    }
  }
}
const openMenu = (e, sectionIndex, app) => {
  rightKeyMenuVisible.value = false;
  iconRightMenuVisible.value = false;
  if (e.currentTarget.offsetHeight - e.pageY < 110) {
    rightKeyMenuTop.value = e.pageY;
  } else {
    rightKeyMenuTop.value = e.pageY;
  }
  if (e.currentTarget.offsetWidth - e.pageX < 110) {
    rightKeyMenuLeft.value = e.pageX - 120;
  } else {
    rightKeyMenuLeft.value = e.pageX;
  }

  selectSectionAppItemSectionIndex.value = sectionIndex;
  if (e.currentTarget.id && e.currentTarget.id.startsWith("appItem")) {
    let appIndex = 0
    if (app) {
      for (let it of iconDefaultData.value[sectionIndex].children) {
        if (it.name === app.name && it.id === app.id) {
          break;
        }
        appIndex++;
      }
      selectSectionAppItemIndex.value = appIndex;
      selectSectionAppItem.value = app;
    }
    iconRightMenuVisible.value = true; //在这里控制右键菜单的打开
    if (event && event.stopPropagation) { //W3C
      event.stopPropagation();
    }
  } else {
    rightKeyMenuVisible.value = true; //在这里控制右键菜单的打开
  }
}
const closeMenu = (e) => {
  rightKeyMenuVisible.value = false;
  iconRightMenuVisible.value = false;
}
const deleteAppItem = () => {
  Modal.confirm({
    title: t('common.confirmDelete'),
    icon: Icon("ExclamationCircleOutlined"),
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise((resolve, reject) => {
        let i = 0
        let item = selectSectionAppItem.value
        let sectionIndex = selectSectionAppItemSectionIndex.value
        for (let it of iconDefaultData.value[sectionIndex].children) {
          if (it.name === item.name && it.id === item.id) {
            iconDefaultData.value[sectionIndex].children.splice(i, 1);
            break
          }
          i++
        }
        localStorage.setItem("iconDefaultData", JSON.stringify(iconDefaultData.value))
        resolve();
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {
    },
  });

}
const batchDeleteAppItem = (item) => {
  let i = 0
  let sectionIndex = selectSectionAppItemSectionIndex.value
  for (let it of iconDefaultData.value[sectionIndex].children) {
    if (it.name === item.name && it.id === item.id) {
      iconDefaultData.value[sectionIndex].children.splice(i, 1);
      break
    }
    i++
  }
  localStorage.setItem("iconDefaultData", JSON.stringify(iconDefaultData.value))
}
const initSearchEngine = () => {
  let defaultSearchEngine = localStorage.getItem("defaultSearchEngine")
  if (defaultSearchEngine) {
    defaultSearchEngine = JSON.parse(defaultSearchEngine);
    searchEngine.value = locale.value === 'zh_cn'?defaultSearchEngine.name : defaultSearchEngine.nameEn
  }
  if (!searchEngine.value) {
    searchEngine.value = locale.value === 'zh_cn'?searchEngineList[0].name : searchEngineList[0].nameEn
  }
}
const changeSearchEngine = (value) => {
  for (let engine of searchEngineList) {
      if (engine.name === value || engine.nameEn === value) {
        localStorage.setItem("defaultSearchEngine", JSON.stringify(engine));
        break;
      }
  }
}
const search = () => {
  if (searchEngine.value && keyword.value) {
    let url = '';
    for (let engine of searchEngineList) {
      if (engine.name === searchEngine.value || engine.nameEn === searchEngine.value) {
        url = engine.url;
        break;
      }
    }
    window.open(url + keyword.value, "_blank");
  }
}
const appClick = (item, sectionIndex) => {
  let appIndex = 0;
  for (let it of iconDefaultData.value[sectionIndex].children) {
    if (it.name === item.name && it.id === item.id) {
      break;
    }
    appIndex++;
  }
  if (item.type === 'icon' || item.type === 'text') {
    window.open(item.url, "_blank");
  } else if (item.type === 'component') {
    if (item.id === '96eb2b757ec51234b1d2a5d6bf13311a') { // 热点榜单
      hotRankModal.value.showModal()
    } else if (item.id === 'fb9934a62e194e67ab46102c05ee45ce') {
      addAppItemModal.value.showModal()
    } else if (item.id === '96eb2b757ec54b35b1d2a5d6bf13311a') {
      todoListModal.value.showModal()
    } else if (item.id === '8aa6b3c126a94b939988e184a2c10f26') {
      settingModal.value.visible = true;
    } else if (item.id === 'da0ebd0b0f2142c723f3s37df80d3241') {
      appStoreModal.value.showModal()
    } else if (item.component === 'countdown' || item.component === 'countdownTime') {
      countdownModal.value.showModal()
      countdownModal.value.editWidget(item, sectionIndex, appIndex)
    } else if (item.id === '134df2c360e14809b15054a0be4eb57b') {
      calendarModal.value.showModal()
    } else if (item.id === '006e4b384ffb4e60b823454bb4fk49fk') {
      nightClockWidgetModal.value.showModal()
    } else if (item.id === 'a5f51a862bfd408ba456b8d6c7afcd78') {
      todayPoetryModal.value.showModal()
    } else if (item.id === '96eb2b756ec8793443d2a5d32f13311a') {
      aiModal.value.showModal()
    }
  }
}
const moveToFirstPage = (index) => {
  const appItem = selectSectionAppItem.value
  const appIndex = selectSectionAppItemIndex.value
  const sectionIndex = selectSectionAppItemSectionIndex.value
  iconDefaultData.value[index].children.push(appItem);
  iconDefaultData.value[sectionIndex].children.splice(appIndex, 1);
  saveIconDefaultData()
  message.info("操作成功！")
}
const saveIconDefaultData = () => {
  localStorage.setItem("iconDefaultData", JSON.stringify(iconDefaultData.value));
}
const changeAppIconlayout = (value) => {
  let sectionIndex = selectSectionAppItemSectionIndex.value;
  let appIndex = selectSectionAppItemIndex.value;
  selectSectionAppItem.value.size = value;
  iconDefaultData.value[sectionIndex].children[appIndex].size = value;
  localStorage.setItem("iconDefaultData", JSON.stringify(iconDefaultData.value));
}
const initClock = (show, style) => {
  if (typeof (show) === 'undefined') {
    let clockConfig = localStorage.getItem("clockConfig")
    if (!clockConfig) return
    let data = JSON.parse(clockConfig);
    show = data.show
    style = data.style
  }
  if (show && (show === "true" || show === true)) {
    let ctx = clock.value.getContext('2d')
    let clockStyleArr = [
      ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "1", "2"],
      ["③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "①", "②"],
      ["三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "一", "二"],
      ["叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾", "拾壹", "拾贰", "壹", "贰"],
      ["Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ", "Ⅰ", "Ⅱ"]
    ]
    clockOption.hours = clockStyleArr[style - 1];
    drawClock(ctx, clockOption)
    timer = setInterval(function () {
      drawClock(ctx, clockOption)
    }, 1000)
    clockOption.showClock = show
  } else {
    if (timer !== null) {
      clearInterval(timer)
      clockOption.showClock = show
    }
  }
}
const initThemeMode = ()=>{
  let themeMode = localStorage.getItem("themeMode");
  if(themeMode){
    changeThemeMode(JSON.parse(themeMode).themeMode === true?'dark':'light')
  }
}
initThemeMode();
initDateTime();
initIconList();
initUserInfo();
initWallPaper();
initSearchEngine();
onMounted(() => {
  initClock()
})
// defineWatch(rightKeyMenuVisible, (newValue, oldValue) => {
//   console.log('值发生了变更', newValue, oldValue);
// });
document.body.addEventListener('click', closeMenu)

</script>
<style lang="less" scoped>
.ant-layout{
  background: none;
}
.ant-layout-header{
  background: none;
  padding:0;
  line-height:normal;
}
</style>
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
/* <768px */
@media screen and (max-width: 768px) {
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

.app-grid {
  overflow-y: auto;
  min-height: 500px;
  width: 80%;
  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, calc(var(--item-size) + var(--item-gap-y)));
    grid-template-rows: repeat(auto-fill, calc(var(--item-size) + var(--item-gap-x)));
    grid-auto-flow: dense;
    justify-content: center;
    box-sizing: border-box;
    margin-top: 20px;

    .item {
      padding: 0 calc(var(--item-gap-y) / 2) calc(var(--item-gap-x));
      box-sizing: border-box;
      cursor: pointer;
      position: relative;

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

.img-1x1, .img-2x2 {
  width: 100%;
  height: 100%;
}

.img-1x2, .img-2x4 {
  height: 100% !important;
}

.img-2x1 {
  width: 100% !important;
  margin-top: 80%;
}

.fullpage {
  //background-color: rgb(189, 211, 186);
  // background: url("../../../static/images/wallpaper/2zrdI1g.jpg");
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  height: 100vh;
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
  top: 40px;
  left: 50%;
  width: 500px;
  margin-left: -250px;

  .search-box {
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
    margin-left: 10px;

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
        box-shadow: none;
        border: none;
        cursor: pointer
      }

      .ant-input-search .ant-input:hover,
      .ant-input-search .ant-input:focus {
        border: none;
        box-shadow: none;
      }

      .ant-input {
        box-shadow: none;
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
        box-shadow: none;
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

  .translate {
    width: 470px;
    height: 30px;
    background: rgb(235, 235, 235, 0.8);
    line-height: 30px;
    border-radius: 7px;
    font-size: 14px;
    display: inline-flex;
    justify-content: space-evenly;
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
  min-width: 100px;
  max-width: 150px;
}


.contextmenu li {
  margin-left: 10px;
  line-height: 20px;
  cursor: pointer;
  text-align: left;

  .contextmenu-layout {
    //width: 105px;
    margin-right: 10px;
    background-color: rgba(var(--alpha-bg), .9);
  }

  .icon {
    margin-right: 5px;
  }

  .contextmenu-layout em {
    display: inline-block;
    font-size: 12px;
    //height: 14px;
    //line-height: 14px;
    min-width: 30px;
    padding: 2px 5px;
    //background-color: rgba(var(--alpha-bg), .6);
    background-color: #cfcfcf;
    border-radius: 5px;
    text-align: center;
    margin: 4px;
    cursor: pointer;
    transition: background-color .25s;
  }

  em:hover {
    background-color: rgba(131, 131, 131, 0.7);
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

.rightBar {
  top: 0 !important;
  right: 0 !important;
}

.topBar {
  top: 0 !important;
  flex-direction: row !important;
  width: 100% !important;
  height: auto !important;
  padding: 0 10px;
}

.bottomBar {
  top: auto !important;
  bottom: 0 !important;
  flex-direction: row !important;
  width: 100% !important;
  height: auto !important;
  padding: 0 10px;
}



.toolsBar {
  transition: .1s;
  justify-content: center;
  height: 40px;
  width: 100%;
  line-height: 40px;
  //position: absolute;
  //top: 0;
  z-index:1;
  .supportAuthor {
    margin-top:5px;
    div {
      line-height: 30px;
      display: inline-block;
      background-color: rgba(var(--alpha-bg), 0.6);
      color:rgba(var(--img-text), 1);
      padding: 0 10px;
      border-radius: 15px;
      float: right;
      margin-right: 15px;
      margin-top:6px;
      cursor:pointer;
      .icon{
        margin-right:5px;
      }
    }

    div:hover {
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
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  //background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  //align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-pagination-bullet {
  min-width: 70px;
  width:auto;
  padding:0 5px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #000;
  opacity: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;

}
.swiper-pagination-bullet{
  background: var(--ant-primary-color-active-deprecated-f-30) ;
}
.swiper-pagination-bullet-active {
  color: #fff;
  background: var(--ant-primary-color);
}
</style>