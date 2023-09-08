<template>
  <div id="fullpage" class="fullpage " :class="themeMode"
       :style="bgWallpaper">
    <!--    <full-page ref="fullpage" :options="options">-->
    <!-- style="backdrop-filter: blur(1px)" -->
    <div :id="'section'+(index+1)" class="section" :class="'section'+(index+1)"
         v-for="(item,index) in iconDefaultData.value" v-bind:key="index" @contextmenu.prevent="openMenu($event)">
      <div class="app-grid" :style="currentIconPage === index?'':'display:none'">

        <!--            @start="drag = true"-->
        <!--            @end="drag = false"-->
        <draggable class="wrapper" v-model="item.children" @start="dragEnterEvent" @end="dragEnterOver"
                   item-key="index">
          <template #item="{ element }">
            <div class="item" :class="'icon-size-'+(element.size?element.size:'1x1')">
              <!--              {{element.id}}-->
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
                <countdown-widget
                    v-else-if="element.type==='component' && (element.component==='countdown'||element.component==='countdownTime')"
                    :size="element.size?element.size:'1x1'" :form="element"></countdown-widget>
                <calendar-widget v-else-if="element.type==='component' && element.component==='calendar'"
                                 :size="element.size?element.size:'1x1'"></calendar-widget>

                <today-english-widget v-else-if="element.type==='component' && element.component==='todayEnglish'"
                                      :size="element.size?element.size:'1x1'"/>
                <today-sentence-widget v-else-if="element.type==='component' && element.component==='todaySentence'"
                                       :size="element.size?element.size:'1x1'"/>
                <today-poetry-widget v-else-if="element.type==='component' && element.component==='todayPoetry'"
                                       :size="element.size?element.size:'1x1'"/>
              </div>
              <div class="app-title">{{ $i18n.locale === 'zh_cn' ? element.name : element.nameEn }}</div>
            </div>
          </template>
        </draggable>
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
    <div class="leftBar" :class="navbarConfig.position==='top'?'topBar':
        navbarConfig.position==='right'?'rightBar':
        navbarConfig.position==='bottom'?'bottomBar':
        '1'" v-show="navbarConfig.show"  >
      <div class="loginVisible" @click="showDialog('userLogin')">
        <div v-if="userInfo.nickName" class="login" @click="drawer('person')">
          <a>{{ userInfo.nickName }}</a>
        </div>
        <div v-else class="login">
          <a-tooltip placement="right">
            <template #title>
              <span>{{ $t('common.login') }}</span>
            </template>
            <Icon class="icon" icon="UserOutlined"/>
          </a-tooltip>
        </div>
      </div>
      <div v-for="(item,index) in iconDefaultData.value" v-bind:key="index" @click="selectDesktop(item,index)"
           class="leftBarItem"
           :class="currentIconPage === index?'leftBarItemSelected':''">
        <a><i :class="'el-icon-'+item.icon"></i>{{ locale === 'zh_cn' ? item.name : item.nameEn }}</a>
      </div>
      <a>
        <Icon class="leftBarPlus" icon="PlusCircleOutlined"/>
      </a>
      <div class="settingVisible" @click="showDialog('setting')">
        <a-tooltip placement="right">
          <template #title>
            <span>{{ $t('common.setting') }}</span>
          </template>
          <Icon icon="SettingOutlined"/>
        </a-tooltip>
      </div>
    </div>
    <div class="search-container">
      <div class="search-box">
        <div class="search">
          <a-select v-model:value="searchEngine" style="width:30%;" @change="changeSearchEngine()">
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
        <span v-if="dateTimeConfig.showTime" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''" @click="nightClockWidget.showModal()">{{ nowDateTime }} </span>
        <span v-if="dateTimeConfig.week" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''">
					{{ nowWeek }}
				</span>
        <span v-if="dateTimeConfig.lunar" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''">
					{{ nowLunar }}
				</span>
        <span v-if="dateTimeConfig.lunar" :style="dateTimeConfig.color?'color:'+dateTimeConfig.color:''">
        {{currentDay}}
				</span>
      </div>
      <div style="clear:both"></div>
    </div>
    <!--图标应用右键菜单-->
    <ul class="contextmenu" id="menuhome_section" v-show="rightKeyMenuVisible"
        :style="{left:rightKeyMenuLeft+'px',top:rightKeyMenuTop+'px'}">
      <li class="contextmenu-item hover" @click="addAppItem()">
        <Icon class="icon" icon="PlusCircleOutlined"/>
        {{ $t("action.addIcon") }}
      </li>
      <li class="contextmenu-item hover" @click="changeWallpaper()">
        <Icon class="icon" icon="SlackOutlined"/>
        {{ $t("action.changeWallpaper") }}
      </li>
      <li class="contextmenu-item hover"><a :href="bgWallpaper.indexOf('http')===0?bgWallpaper:'#'" target="_blank">
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
        {{ $t("action.moveToHome") }}
        <div class="contextmenu-layout">
          <em v-for="(item,index) in iconDefaultData.value" :key="index" @click="moveToFirstPage(index)">
            {{ locale === 'zh_cn' ? item.name : item.nameEn }}
          </em>
        </div>
      </li>
      <li class="contextmenu-item" v-if="isDisableItem()">
        <Icon icon="LayoutOutlined"/>
        {{ $t("common.layout") }}
        <div class="contextmenu-layout">
          <em class="" @click="changeAppIconlayout('1x1')">1x1</em>
          <em class="" @click="changeAppIconlayout('1x2')">1x2</em>
          <em class="" @click="changeAppIconlayout('2x1')">2x1</em>
          <em class="" @click="changeAppIconlayout('2x2')">2x2</em>
          <em class="" @click="changeAppIconlayout('2x4')">2x4</em>
        </div>
      </li>
      <li class="contextmenu-item hover" v-if="isDisableItem()">
        <Icon icon="EditOutlined"/>
        {{ $t("common.edit") }}
      </li>
      <li class="contextmenu-item hover" v-if="isDisableItem()" @click="batchDeleteAppItemVisible = !batchDeleteAppItemVisible">
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
             @changeClock="initClock" @changeNavbar="initNavbar"></setting>
    <add-app-item ref="addAppItemModal" @ok="initIconList()"></add-app-item>
    <!--		<search-icon ref="searchIcon"></search-icon>-->
    <login ref="userLogin" @success="initUserInfo()"></login>
    <todo-list ref="todoListModal"></todo-list>
    <support-author ref="supportAuthor"></support-author>
    <privatization ref="privatization"></privatization>
    <countdown ref="countdown" @ok="initIconList()"></countdown>
    <calendar ref="calendar"></calendar>
    <app-store ref="appStoreModal" @addIcon="addIcon"></app-store>
    <night-clock-widget ref="nightClockWidget" />
    <wall-paper ref="wallpaper" @ok="initWallPaper"></wall-paper>
    <today-poetry ref="todayPoetry"></today-poetry>
    <!--		<person ref="person" :user-info="userInfo"></person>-->
  </div>
</template>
<script>
import {
  ref,
  toRefs,
  reactive,
  onMounted,
  watch
} from 'vue'
import draggable from 'vuedraggable'
import drawClock from '@/utils/clock'
import {
  randomNumber,
  dateFormat,
  parseTime,
  strFormat
} from '@/utils/util'
import {
  getLunar
} from '@/utils/getLunar.js'
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
import todayPoetryWidget from "@/views/widgets/todayPoetryWidget";
import nightClockWidget from "@/views/widgets/nightClockWidget";

// import themePicker from "@/components/ThemePicker";
// import crypto from "@/utils/crypto";
import {useI18n} from "vue-i18n";
import Icon from "@/components/icon"
import {
  Modal,
  message
} from "ant-design-vue";
import wallPaper from "@/views/desktop/wallPaper";
import TodayPoetry from "@/views/widgets/todayPoetry";
export default {
  name: "desktopIndex",
  directives: {
    // waves
  },
  components: {
    TodayPoetry,
    wallPaper,
    nightClockWidget,
    todayEnglishWidget,
    todaySentenceWidget,
    todayPoetryWidget,
    AppStore,
    Icon,
    draggable,
    setting,
    addAppItem,
    // searchIcon,
    login,
    todoList,
    supportAuthor,
    privatization,
    calendar,
    calendarWidget,
    countdown,
    countdownWidget
    // person
  },
  setup() {
    const nightClockWidget= ref(null)
    const clock = ref(null)
    const supportAuthor = ref(null)
    const privatization = ref(null)
    const settingModal = ref(null)
    const userLogin = ref(null)
    const calendar = ref(null)
    const countdown = ref(null)
    const appStoreModal = ref(null)
    const addAppItemModal = ref(null)
    const todoListModal = ref(null)
    const wallpaper = ref(null)
    const todayPoetry = ref(null)
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
    const {
      t,
      locale
    } = useI18n()
    let components = {
      supportAuthor,
      privatization,
      settingModal,
      userLogin,
      calendar,
      calendarWidget,
      countdown,
      countdownWidget,
      appStoreModal,
      addAppItemModal,
      todoListModal,
      nightClockWidget,
      wallpaper,
      todayPoetry
    }

    const navbarConfig = reactive({show: true, position: 'left'})
    let data = {
      keyword: ref(''),
      windmillRotate: ref(false),
      drawerVisible: ref(false),
      dateTimeConfig: reactive({
        showTime: true,
        format: "yyyy-MM-dd",
        week: true,
        lunar: true,
        color: '#ffffff',
        weight: true,
        timestamp: 1000 * 60 * 60 * 24,
        day: true,
      }),
      // background: "https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1673912402587-57ac40f1b4a5?ixid=M3w0MjI2NjN8MHwxfHRvcGljfHx4alBSNGhsa0JHQXx8fHx8Mnx8MTY4ODE5OTQyN3w&ixlib=rb-4.0.3&w=2560&h=1440&fmt=webp",
      bgWallpaper: ref(null),
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
      currentDay: ref(''),
      currentIconPage: ref(0),
      iconDefaultData: reactive([]),
      searchEngine: ref(''),
      searchEngineList: reactive([{
        "key": "baidu",
        "name": "百度",
        "nameEn": "Baidu",
        "url": "https://www.baidu.com/s?wd="
      },
        {
          "key": "bing",
          "name": "必应",
          "nameEn": "Bing",
          "url": "https://cn.bing.com/search?q="
        },
        {
          "key": "google",
          "name": "谷歌",
          "nameEn": "Google",
          "url": "https://www.google.com/search?q="
        },
        {
          "key": "github",
          "name": "Github",
          "nameEn": "Github",
          "url": "https://github.com/search?q="
        },
        {
          "key": "gitee",
          "name": "Gitee",
          "nameEn": "Gitee",
          "url": "https://search.gitee.com/?skin=rec&type=repository&q="
        },
        {
          "key": "douyin",
          "name": "抖音",
          "nameEn": "DouYin",
          "url": "https://www.douyin.com/search/"
        },
        {
          "key": "kuaishou",
          "name": "快手",
          "nameEn": "Kwai",
          "url": "https://kuaishou.cn/search/video?searchKey="
        },
        {
          "key": "xiaohongshu",
          "name": "小红书",
          "nameEn": "RedBook",
          "href": "https://www.xiaohongshu.com/search_result/?&m_source=itab&keyword="
        },
        {
          "key": "duckduckgo",
          "name": "DuckDuckGo",
          "nameEn": "DuckDuckGo",
          "href": "https://duckduckgo.com/?q="
        },
        {
          "key": "zhihu",
          "name": "知乎",
          "nameEn": "ZhiHu",
          "href": "https://www.zhihu.com/search?type=content&q="
        },
        {
          "key": "sougou",
          "name": "搜狗",
          "nameEn": "Sogou",
          "href": "https://www.sogou.com/sogou?query="
        },
        {
          "key": "360",
          "name": "360",
          "nameEn": "360",
          "href": "https://www.so.com/s?q="
        },
        {
          "key": "stackoverflow",
          "name": "StackOverflow",
          "nameEn": "StackOverflow",
          "href": "https://stackoverflow.com/nocaptcha?s="
        },
        {
          "key": "toutiao",
          "name": "头条搜索",
          "nameEn": "TouTiao",
          "href": "https://so.toutiao.com/search?dvpf=pc&keyword="
        },
        {
          "key": "douban",
          "name": "豆瓣",
          "nameEn": "DouBan",
          "href": "https://www.douban.com/search?q="
        },
        {
          "key": "bilibili",
          "name": "哔哩哔哩",
          "nameEn": "BiLiBiLi",
          "href": "https://search.bilibili.com/all?keyword="
        },
        {
          "key": "kaifabaidu",
          "name": "开发者搜索",
          "nameEn": "DevSearch",
          "href": "https://kaifa.baidu.com/searchPage?wd="
        },
        {
          "key": "mdn",
          "name": "MDN",
          "nameEn": "MDN",
          "href": "https://developer.mozilla.org/zh-CN/search?q="
        }
      ]),
      translateList: reactive([]),
      selectSectionAppItem: reactive({}),
      selectSectionAppItemSectionIndex: ref(0),
      selectSectionAppItemIndex: ref(0),
      rightKeyMenuVisible: ref(false),
      iconRightMenuVisible: ref(false),
      rightKeyMenuTop: ref(0),
      rightKeyMenuLeft: ref(0),
      dragNav: reactive({}),
      batchDeleteAppItemVisible: ref(false),
      userInfo: reactive({
        nickName: "",
        avatarUrl: "",
        lastLoginTime: "",
        lastLoginIp: ""
      }),
      t,
      locale,
      clock,
      clockOption,
      navbarConfig
    }

    const state = reactive({
      drag: false,
      list: [1, 2, 3, 4, 5, 6]
    })
    // themePicker.methods.themeChange(data.themeColor);

    let timer = null

    const methods = {
      isDisableItem:()=>{
        if(data.selectSectionAppItem.value){
          if(data.selectSectionAppItem.value.id ==='da0ebd0b0f2142c723f3s37df80d3241' ||
              data.selectSectionAppItem.value.id ==='fb9934a62e194e67ab46102c05ee45ce' ||
              data.selectSectionAppItem.value.id ==='8aa6b3c126a94b939988e184a2c10f26'){
            return false
          }
        }
        return true
      },
      initTranslate:()=>{
        data.translateList= require('@/assets/json/translate.json')
      },
      getTranslateUrl: (item) => {
        return strFormat(item.url, [data.keyword.value]);
      },
      addIcon: (item) => {
        data.iconDefaultData.value[item.index].children.push(item.app);
      },
      rotate: () => {
        data.windmillRotate.value = true;

        setTimeout(function () {
          data.windmillRotate.value = false;
          const bgData = require('@/assets/json/otherWallpaper.json');
          const random = Number(randomNumber(0, 111))
          const bg = bgData[random].raw;
          data.bgWallpaper.value = bg;
          localStorage.setItem("bgWallpaper", bg);
          methods.initWallPaper();
        }, 3000);
      },
      initDateTime: () => {
        let dateTimeConfig = localStorage.getItem('dateTimeConfig')
        if (dateTimeConfig && dateTimeConfig.length > 0) {
          data.dateTimeConfig = reactive(JSON.parse(dateTimeConfig));
        } else {
          let config = data.dateTimeConfig
          localStorage.setItem("dateTimeConfig", JSON.stringify(config))
        }
        let date = new Date()
        if (data.dateTimeConfig.showTime) {
          data.nowDateTime = dateFormat(data.dateTimeConfig.format, new Date());
          setInterval(function () {
            data.nowDateTime = dateFormat(data.dateTimeConfig.format, new Date())
          }, data.dateTimeConfig.timestamp)
        }
        if (data.dateTimeConfig.week) {
          data.nowWeek = parseTime(date, '{a}', locale.value)
        }
        if (data.dateTimeConfig.lunar) {
          data.nowLunar = getLunar(date);
        }

        if (data.dateTimeConfig.day) {
          let year = new Date(date.getFullYear(), 0, 0);
          let day = parseInt((date - year) / 24 / 60 / 60 / 1000)
          data.currentDay = "第"+day + "天  第"+Math.ceil(day / 7)+"周"
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
          data.iconDefaultData.value = iconDefaultData;
        }
      },
      initUserInfo: () => {
        let userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
          userInfo = crypto.decrypt(userInfo);
          this.userInfo = JSON.parse(userInfo);
        }
      },
      initWallPaper: () => {
        let bgWallpaper = localStorage.getItem('bgWallpaper')
        if (bgWallpaper && bgWallpaper.length > 0) {
          if(bgWallpaper&&bgWallpaper.indexOf('http') === 0){
            data.bgWallpaper.value = 'background: url('+bgWallpaper+') no-repeat center center;'+
                'background-color:rgb(0,0,0,0.5);background-position-x:center;background-position-y:center;'
          }else if(bgWallpaper&&bgWallpaper.indexOf('/img/') === 0){
            data.bgWallpaper.value = 'background: url('+bgWallpaper+') no-repeat center center;'+
                'background-color:rgb(0,0,0,0.5);background-position-x:center;background-position-y:center;'
          }else{
            data.bgWallpaper.value = 'background:'+bgWallpaper
          }
        } else {
          let bg = methods.getBackgroundImgUrl('background.jpg');
          localStorage.setItem("bgWallpaper", bg)
          data.bgWallpaper.value = 'background: url('+bg+');background-color:rgb(0,0,0,0.5);background-size:100% 100%;'
        }
      },
      selectDesktop: (item, index) => {
        data.currentIconPage.value = index
      },
      changeThemeMode: (mode) => {
        this.themeMode = mode;
      },
      changeDateTime: (value) => {
        data.dateTimeConfig = value;
        if (data.dateTimeConfig.showTime) {
          methods.initDateTime()
        }
      },
      changeWallpaper:()=>{
        wallpaper.value.showModal()
      },
      showDialog: (value) => {
        if (value === 'supportAuthor') {
          supportAuthor.value.showModal();
        } else if (value === 'privatization') {
          privatization.value.showModal();
        } else if (value === 'userLogin') {
          userLogin.value.showModal();
        } else if (value === 'setting') {
          settingModal.value.visible = true;
        }
      },
      getImgUrl: (item) => {
        if (!item.src) {
          return;
        }
        if(item.src.indexOf("http") !== -1) {
          return item.src
        }else{
          try {
            return require('@/assets/images/logos/' + item.src + "");
          } catch (e) {}
        }
      },
      getBackgroundImgUrl: (image) => {
        return require('@/assets/images/wallpaper/' +image);
      },
      allowDrop: (event) => {
        event.preventDefault();
      },
      dragEnterEvent: (event) => {
        data.dragNav = event.item;
      },
      dragEnterOver: (event) => {
        data.dragNav = null;
        localStorage.setItem("iconDefaultData", JSON.stringify(data.iconDefaultData.value))
      },
      dropEvent: (event) => {
        event.preventDefault();
        if (!data.dragNav.id) {
          return;
        }
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
      openMenu: (e, sectionIndex, app) => {
        data.rightKeyMenuVisible.value = false;
        data.iconRightMenuVisible.value = false;
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

        data.selectSectionAppItemSectionIndex.value = sectionIndex;
        if (e.currentTarget.id && e.currentTarget.id.startsWith("appItem")) {
          let appIndex = 0
          if (app) {
            for (let it of data.iconDefaultData.value[sectionIndex].children) {
              if (it.name === app.name && it.id === app.id) {
                break;
              }
              appIndex++;
            }
            data.selectSectionAppItemIndex.value = appIndex;
            data.selectSectionAppItem.value = app;
          }
          data.iconRightMenuVisible.value = true; //在这里控制右键菜单的打开
          if (event && event.stopPropagation) { //W3C
            event.stopPropagation();
          }
        } else {
          data.rightKeyMenuVisible.value = true; //在这里控制右键菜单的打开
        }
      },
      closeMenu: (e) => {
        data.rightKeyMenuVisible.value = false;
        data.iconRightMenuVisible.value = false;
      },
      deleteAppItem: () => {
        Modal.confirm({
          title: t('common.confirmDelete'),
          icon: Icon("ExclamationCircleOutlined"),
          okText: '确认',
          cancelText: '取消',
          onOk() {
            return new Promise((resolve, reject) => {
              let i = 0
              let item = data.selectSectionAppItem.value
              let sectionIndex = data.selectSectionAppItemSectionIndex.value
              for (let it of data.iconDefaultData.value[sectionIndex].children) {
                if (it.name === item.name && it.id === item.id) {
                  data.iconDefaultData.value[sectionIndex].children.splice(i,
                      1);
                  break
                }
                i++
              }
              localStorage.setItem("iconDefaultData", JSON.stringify(data
                  .iconDefaultData.value))
              resolve();
            }).catch(() => console.log('Oops errors!'));
          },
          onCancel() {
          },
        });

      },
      batchDeleteAppItem: (item) => {
        let i = 0
        let sectionIndex = data.selectSectionAppItemSectionIndex.value
        for (let it of data.iconDefaultData.value[sectionIndex].children) {
          if (it.name === item.name && it.id === item.id) {
            data.iconDefaultData.value[sectionIndex].children.splice(i,
                1);
            break
          }
          i++
        }
        localStorage.setItem("iconDefaultData", JSON.stringify(data.iconDefaultData.value))
      },
      initSearchEngine: () => {
        let defaultSearchEngine = localStorage.getItem("defaultSearchEngine")
        if (defaultSearchEngine) {
          defaultSearchEngine = JSON.parse(defaultSearchEngine);
          data.searchEngine.value = locale.value === 'zh_cn' ? defaultSearchEngine.name :
              defaultSearchEngine.nameEn
        }
        if (!data.searchEngine.value) {
          data.searchEngine.value = locale.value === 'zh_cn' ? '百度' : 'Baidu'
        }
      },
      changeSearchEngine: () => {
        for (let engine of data.searchEngineList) {
          const name = locale.value === 'zh_cn' ? engine.name : engine.nameEn
          if (name === data.searchEngine.value) {
            localStorage.setItem("defaultSearchEngine", JSON.stringify(engine));
            break;
          }
        }
      },
      search: () => {
        if (data.searchEngine.value && data.keyword.value) {
          let url = '';
          for (let engine of data.searchEngineList) {
            if (engine.name === data.searchEngine.value) {
              url = engine.url;
              break;
            }
          }
          window.open(url + data.keyword.value, "_blank");
        }
      },
      appClick: (item, sectionIndex) => {
        let appIndex = 0;
        for (let it of data.iconDefaultData.value[sectionIndex].children) {
          if (it.name === item.name && it.id === item.id) {
            break;
          }
          appIndex++;
        }
        if (item.type === 'icon' || item.type === 'text') {
          window.open(item.url, "_blank");
        } else if (item.type === 'component') {
          if (item.id === 'fb9934a62e194e67ab46102c05ee45ce') {
            addAppItemModal.value.showModal()
          } else if (item.id === '96eb2b757ec54b35b1d2a5d6bf13311a') {
            todoListModal.value.showModal()
          } else if (item.id === '8aa6b3c126a94b939988e184a2c10f26') {
            settingModal.value.visible = true;
          } else if (item.id === 'da0ebd0b0f2142c723f3s37df80d3241') {
            appStoreModal.value.showModal()
          } else if (item.component === 'countdown' || item.component === 'countdownTime') {
            countdown.value.showModal()
            countdown.value.editWidget(item, sectionIndex, appIndex)
          } else if (item.id === '134df2c360e14809b15054a0be4eb57b') {
            calendar.value.showModal()
          } else if (item.id === '006e4b384ffb4e60b823454bb4fk49fk') {
            nightClockWidget.value.showModal()
          } else if (item.id === 'a5f51a862bfd408ba456b8d6c7afcd78') {
            todayPoetry.value.showModal()
          }
        }
      },
      moveToFirstPage: (index) => {
        const appItem = data.selectSectionAppItem.value
        const appIndex = data.selectSectionAppItemIndex.value
        const sectionIndex = data.selectSectionAppItemSectionIndex.value
        data.iconDefaultData.value[index].children.push(appItem);
        data.iconDefaultData.value[sectionIndex].children.splice(appIndex, 1);
        methods.saveIconDefaultData()
        message.info("操作成功！")
      },
      saveIconDefaultData: () => {
        localStorage.setItem("iconDefaultData", JSON.stringify(data.iconDefaultData.value));
      },
      changeAppIconlayout: (value) => {
        let sectionIndex = data.selectSectionAppItemSectionIndex.value;
        let appIndex = data.selectSectionAppItemIndex.value;
        data.selectSectionAppItem.size = value;
        data.iconDefaultData.value[sectionIndex].children[appIndex].size = value;
        localStorage.setItem("iconDefaultData", JSON.stringify(data.iconDefaultData.value));
      },
      whiteOrBlack: () => {
        var hour = new Date().getHours()
        return hour > 6 && hour < 18 ? "#fff" : "#000"
      },
      initClock:(show,style)=>{
        if(typeof (show) === 'undefined'){
          let clockConfig = localStorage.getItem("clockConfig")
          if(!clockConfig) return
          let data = JSON.parse(clockConfig);
          show = data.show
          style = data.style
        }
        if(show && (show==="true" ||show===true)){
          let ctx = clock.value.getContext('2d')
          let clockStyleArr = [
              ["3", "4", "5", "6", "7", "8","9", "10", "11","12", "1", "2"],
              ["③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪","⑫", "①", "②"],
              ["三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "一", "二"],
              ["叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾", "拾壹", "拾贰", "壹", "贰"],
              ["Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ","Ⅻ", "Ⅰ", "Ⅱ"]
          ]
          clockOption.hours = clockStyleArr[style-1];
          drawClock(ctx,clockOption)
          timer = setInterval(function () {
            drawClock(ctx,clockOption)
            console.log(1)
          }, 1000)
          data.clockOption.showClock = show
        }else{
          if(timer!==null){
            clearInterval(timer)
            data.clockOption.showClock = show
          }
        }
      },
      initNavbar:(show,position)=> {
        data.navbarConfig.show = show
        data.navbarConfig.position = position
      },
      initNavbarInfo:()=>{
        let val = localStorage.getItem("navbarConfig")
        if(val === null){
          localStorage.setItem("navbarConfig",JSON.stringify({show:true, position:'left'}))
        }else{
          data.navbarConfig.show = JSON.parse(val).show
          data.navbarConfig.position = JSON.parse(val).position
        }
      }
    }

    methods.initDateTime();
    methods.initIconList();
    methods.initUserInfo();
    methods.initWallPaper();
    methods.initSearchEngine();
    methods.initTranslate();
    onMounted(() => {
      methods.initClock()
      methods.initNavbarInfo()
    })
    watch(data.rightKeyMenuVisible, (newValue, oldValue) => {
      console.log('值发生了变更', newValue, oldValue);
    });
    document.body.addEventListener('click', methods.closeMenu)
    return {
      ...components,
      ...data,
      ...methods,
      ...toRefs(state)
    };
  }
}
</script>
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
<style lang="less">
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
  min-height: 700px;
  padding-top: 130px;
  width: 80%;
  margin-left: 10%;

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

@media screen and (max-width: 768px) {
  .navMenu {
    display: none !important;
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
  top: 50px;
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
.rightBar{
  top:0!important;
  right:0!important;
}
.topBar{
  top:0!important;
  flex-direction: row!important;
  width: 100%!important;
  height: auto!important;
  padding: 0 10px;
}
.bottomBar{
  top: auto!important;
  bottom:0!important;
  flex-direction: row!important;
  width: 100%!important;
  height: auto!important;
  padding: 0 10px;
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
  top: 0;
  .leftBarItem {
    min-height: 30px;
  }

  .leftBarItem:hover {
    background-color: rgba(var(--alpha-bg), .6);
  }

  .leftBarItemSelected {
    background-color: rgba(var(--alpha-bg), .4);
  }

  .leftBarPlus {
    font-size: 18px;
  }

  .leftBarPlus:hover {
    color: #fff;
    font-size: 20px;
  }
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