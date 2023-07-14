<template>
  <div ref="settingDrawer">
    <a-drawer
        :headerStyle="'display:none'"
        :closable="false"
        v-model:visible="visible"
        class="custom-class"
        :title="t('common.setting')"
        placement="right"
        @after-visible-change="afterVisibleChange">
      <a-row :gutter="20" style="margin:0">
        <a-col :span="8" :style="'height:'+height+'px;border-right:1px solid #ccc;padding-right:0;padding-left:0;overflow-x:hidden'">
            <a-menu
              default-active="1"
              class="a-menu-vertical-demo"
              style="height:100%;"
              @select="handleOpen">
              <a-menu-item key="1">
                <Icon icon="SettingOutlined"></Icon>
                <span slot="title">{{ $t("action.basicSetting") }}</span>
              </a-menu-item>
              <a-menu-item key="2">
                <i class="a-icon-search"></i>
                <Icon icon="SearchOutlined"></Icon>
                <span slot="title">{{ $t("action.searchBar") }}</span>
              </a-menu-item>
              <a-menu-item key="3">
                <Icon icon="InfoCircleOutlined"></Icon>
                <span slot="title">{{ $t("common.icon") }}</span>
              </a-menu-item>
              <a-menu-item key="4">
                <Icon icon="ClockCircleOutlined"></Icon>
                <span slot="title">{{ $t("action.dateTime") }}</span>
              </a-menu-item>
              <a-menu-item key="5">
                <Icon icon="FileImageOutlined"></Icon>
                <span slot="title">{{ $t("action.themeWallpaper") }}</span>
              </a-menu-item>
              <a-menu-item key="6">
                <Icon icon="TableOutlined"></Icon>
                <span slot="title">{{ $t("common.layout") }}</span>
              </a-menu-item>
              <a-menu-item key="7">
                <Icon icon="AntCloudOutlined"></Icon>
                <span slot="title">{{ $t("action.backupRecovery") }}</span>
              </a-menu-item>
              <a-menu-item key="8">
                <Icon icon="CrownOutlined"></Icon>
                <span slot="title">{{ $t("action.about") }}</span>
              </a-menu-item>
            </a-menu>
        </a-col>
        <a-col :span="16">
          <div class="grid-content bg-purple">
            <div style="color:var(--img-text);font-size:26px;text-align:right;margin-right:10px;margin-top:8px;" @click="drawer=false" >
              <i class="a-icon-s-unfold"></i>
            </div>
            <div v-if="menuIndex==='1'">
              <div class="settingItem">
                <span class="title">{{ $t("action.languageSwitch") }}</span>
                <div class="content">
                  <a-button size="small" :type="currentLanguage === 'zh_cn'?'primary':''" @click="changeLanguage('zh_cn')">
                    {{ $t("action.chinese") }}
                  </a-button>
                  <a-button size="small" :type="currentLanguage === 'en_us'?'primary':''" @click="changeLanguage('en_us')">
                    {{ $t("action.english") }}
                  </a-button>
                  <a-button size="small" :type="currentLanguage === 'ja'?'primary':''" @click="changeLanguage('ja')">
                    {{ $t("action.japanese") }}
                  </a-button>
                  <a-button size="small" :type="currentLanguage === 'ko-KR'?'primary':''" @click="changeLanguage('ko-KR')">
                    {{ $t("action.korean") }}
                  </a-button>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("common.reset") }} {{ $t("common.setting") }}</span>
                <div class="content">
                  <span class="desc">{{ $t("action.resetConfig") }}</span>
                  <div>
                    <a-button size="small" type="primary" @click="resetSetting()">{{ $t("common.reset") }}</a-button>
                  </div>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("common.reset") }} {{ $t("common.icon") }}</span>
                <div class="content">
                  <span class="desc">{{ $t("action.resetIcon") }}</span>
                  <div>
                    <a-button size="small" type="primary" @click="resetIcon()">{{ $t("common.reset") }}</a-button>
                  </div>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("common.accountCancellation") }}</span>
                <div class="content">
                  <a-button size="small" type="primary" @click="cancellation()">{{ $t("common.cancellation") }}</a-button>
                </div>
              </div>
            </div>
            <div v-if="menuIndex==='4'">
              <div class="settingItem">
                {{showTime}}
                <div class="content">
                  {{t('action.showTime')}} <a-switch v-model:checked="showTime" @change="changeDateTime"></a-switch>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.dateTimeFormat") }}</span>
                <div class="content">
                  <div class="dateTimeFormat">
                    <a-tag effect="dark" :type="dateTimeConfig.format==='yyyy-MM-dd HH:mm:ss'?'':'info'" @click="changeDateFormat('yyyy-MM-dd HH:mm:ss',1000)">年月日时分秒</a-tag>
                    <a-tag effect="dark" :type="dateTimeConfig.format==='yyyy-MM-dd HH:mm'?'':'info'" @click="changeDateFormat('yyyy-MM-dd HH:mm',6000)">年月日时分</a-tag>
                    <a-tag effect="dark" :type="dateTimeConfig.format==='yyyy-MM-dd'?'':'info'" @click="changeDateFormat('yyyy-MM-dd',1000*60*60*24)">年月日</a-tag>
                    <a-tag effect="dark" :type="dateTimeConfig.format==='MM-dd HH:mm'?'':'info'" @click="changeDateFormat('MM-dd HH:mm')">月日 时分</a-tag>
                    <a-tag effect="dark" :type="dateTimeConfig.format==='MM-dd'?'':'info'" @click="changeDateFormat('MM-dd')">月日</a-tag>
                    <a-tag effect="dark" :type="dateTimeConfig.format==='HH:mm:ss'?'':'info'" @click="changeDateFormat('HH:mm:ss')">时分秒</a-tag>
                    <a-tag effect="dark" :type="dateTimeConfig.format==='HH:mm'?'':'info'" @click="changeDateFormat('HH:mm')">时分</a-tag>
                  </div>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.dateTimeOtherSetting") }}</span>
                <div class="content">
                  <div class="dateTimeOtherSetting">
                    <a-switch v-model="dateTimeConfig.week" inactive-text="星期" @change="changeWeek"></a-switch>
                  </div>
                  <div class="dateTimeOtherSetting">
                    <a-switch v-model="dateTimeConfig.weight" inactive-text="粗细" @change="changeDateWeight"></a-switch>
                  </div>
                  <div class="dateTimeOtherSetting">
                    <a-switch v-model="dateTimeConfig.lunar" inactive-text="阴历" @change="changeDateLunar"></a-switch>
                  </div>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.dateTimeColor") }}</span>
                <div class="content">
                  <div class="iconStyle">
                    <color-picker @ok="selectColor"></color-picker>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="menuIndex==='5'">
              <div class="settingItem">
                <!-- <a-switch v-model="this.$store.state.settings.themeMode==='dark'" :inactive-text="$t('action.darkMode')" @change="changeThemeMode"></a-switch> -->
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.changeThemeColor") }}</span>
                <div class="iconStyle">
                  <div v-for="item in colors" class="colorIcon" :style="'background: '+item" @click="selectThemeColor(item)" />
                  <theme-picker style="margin-top:5px;" ref="themePicker" @change="themeChange"></theme-picker>
                </div>
              </div>
            </div>
            <div v-if="menuIndex==='6'">
              <div class="settingItem">
                <a-switch v-model="showNavBar" :inactive-text="this.$t('action.isShowNavBar')" @change="changeNavBarMode"></a-switch>
              </div>
            </div>
            <div v-if="menuIndex==='8'">
              <div class="settingItem">
                <div class="content">
                  <span>{{ $t("action.version") }}：1.0.1</span>
                </div>
              </div>
              <div class="settingItem">
                <div class="content">
                  <a class="feedback" href="https://support.qq.com/products/451438" target="_blank">{{$t("action.feedback")}}</a>
                </div>
              </div>

              <div class="settingItem">
                <div class="content">
                  <a class="feedback" href="https://support.qq.com/products/451438/blog/764325" target="_blank">
                    {{$t("action.thanks")}}
                  </a>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.contactUs") }}</span>
                <div class="content">
                  <div style="text-align: center;height:150px;">
                    <img src="@/assets/images/douyin.jpg" width="150" style="margin-top:10px;border-radius: 10px;"/><br/>
                      {{$t("action.douyin")}}:qzpenge
                  </div>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.aboutUs") }}</span>
                <div class="content">
                  <div class="aboutus">
                    <a href="https://www.rqzm.cn" target="_blank">{{ $t("action.officialWebsite") }}</a>️
                    <a href="https://www.douyin.com/user/MS4wLjABAAAAavVLkpztz9Y8MZIY2nzOnlNQUisa0htTv5bot57ehCw" target="_blank">{{ $t("action.contactUs") }}</a>️
                    <a href="https://support.qq.com/products/451438/blog/765532" target="_blank">{{ $t("action.privacy") }}</a>️
                    <a href="https://support.qq.com/products/451438/blog/765533" target="_blank">{{ $t("action.disclaimer") }}</a>️
                    <a href="https://support.qq.com/products/451438/blog/765536" target="_blank">{{ $t("action.updateRecord") }}</a>️
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>

<script>
import iconDefaultData from "@/assets/json/navJsonData.json";
import { ref, toRefs, reactive } from "vue";
import {useI18n} from "vue-i18n";
import Icon from "@/components/icon"
// import ColorPicker from "@/components/colorPicker";
// import themePicker from "@/components/ThemePicker";
export default {
  name: "setting",
  components: {
    Icon
	  // ColorPicker,themePicker
  },
  setup(props, { expose,emit }) {
    const { t, locale } = useI18n()
    let showTime =ref();
	  const data = {
      visible: ref(false),
	    height: ref(800),
	    themeMode1: ref('dark'),
	    themeColor: ref(null),//this.$store.state.settings.themeColor,
	    showNavBar: ref(true),
	    menuIndex: ref('1'),
	    currentLanguage: ref('zh_cn'),
	    dateTimeConfig: reactive({
	      showTime: true,
	      format:"yyyy-MM-dd",
	      week: true,
	      lunar: true,
	      color: '#000000',
	      weight: true,
	      timestamp: 1000*60*60*24
	    }),
	    colors: reactive(['#1681ff', '#2ecc71', '#33c5c5', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c']),
      t,
      locale
	  }
    const afterVisibleChange = (bool) => {
      console.log('visible', bool);
    };
	  const methods = {

		  themeChange:(value)=>{
		    this.themeColor = value;
		    this.$store.dispatch('settings/changeSetting',{
		      key: 'themeColor',
		      value: value
		    })
		  },
		  initDateConfig:()=>{
		    let dateTimeConfig = localStorage.getItem('dateTimeConfig')
		    if (dateTimeConfig && dateTimeConfig.length > 0) {
		    	data.dateTimeConfig = JSON.parse(dateTimeConfig);
          showTime.value = data.dateTimeConfig.showTime
		    }
		  },
		  supportAuthor:()=> {
		    this.$parent.$refs["supportAuthor"].dialogVisible = true;
		  },
		  /*showLogin:()=>{
		    this.$parent.$refs["login"].dialogVisible = true;
		  },*/
		  /*logout:()=> {
		    this.$confirm(this.$t('common.confirmExit'), '提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		      this.$api.logout().then(res => {
		        if (res.success) {
		          this.$message({
		            type: 'success',
		            message: '退出成功!'
		          });
		          localStorage.removeItem("userInfo");
		          window.location.reload();
		        } else {
		          this.$api.msg("登录码生成失败！")
		        }
		      })
		    });
		  },*/
		  changeLanguage:(lang)=> {
		    data.locale.value = lang
		    // this.$store.dispatch('ToggleLanguage', lang)
		    localStorage.setItem('language', lang) ;//将lang 语言存在localStorage里
		    window.location.reload();
		  },
		  handleOpen:(item,key, keyPath)=> {
		    data.menuIndex.value = item.key;
		  },
		  changeThemeMode:(bool)=> {
		    let mode = bool ? "dark" : "light";
		    // this.$emit('changeThemeMode', mode);
		    // this.$store.dispatch('settings/changeSetting',{
		    //   key: 'themeMode',
		    //   value: mode
		    // })
		  },
		  changeNavBarMode:(bool)=> {
		    // this.$store.dispatch('settings/changeSetting',{key: 'showNavBar', value: bool})
		    // this.$emit('changeNavBarMode', bool);
		  },
		  changeDateTime:(bool)=> {
        showTime.value = bool
		    data.dateTimeConfig.showTime = bool;
		    methods.saveDateSetting();
        emit("changeDateTime", data.dateTimeConfig)
        console.log("showTime = "+showTime)
		    // window.location.reload();
		  },
		  changeDateFormat:(value,timestamp)=>{
        data.dateTimeConfig.format = value;
        data.dateTimeConfig.timestamp = timestamp;
        methods.saveDateSetting();
		  },
		  changeWeek:(bool)=> {
        data.dateTimeConfig.week = bool;
        methods.saveDateSetting();
		  },
		  changeDateWeight:(bool)=> {
        data.dateTimeConfig.weight = bool;
        methods.saveDateSetting();
		  },
		  changeDateLunar:(bool)=> {
        data.dateTimeConfig.lunar = bool;
        methods.saveDateSetting();
		  },
		  selectColor:(value)=>{
		    data.dateTimeConfig.color = value;
		    methods.saveDateSetting();
		  },
		  selectThemeColor:(value)=>{
		    // this.$store.state.settings.themeColor = value
		    // this.$refs.themePicker.themeChange(value);
		  },
		  saveDateSetting:()=>{
		    // this.$emit('changeDateTime', this.dateTimeConfig);
		    localStorage.setItem('dateTimeConfig', JSON.stringify(data.dateTimeConfig));
		  },
		  saveThemeSetting:()=>{
		    // this.$emit('changeDateTime', this.dateTimeConfig);
		    localStorage.setItem('dateTimeConfig', JSON.stringify(data.dateTimeConfig));
		  },
		  resetIcon:()=>{
		    let iconDefaultData = require('@/assets/json/navJsonData.json');
		    localStorage.setItem("iconDefaultData",JSON.stringify(iconDefaultData));
		    data.iconDefaultData = iconDefaultData;
		    window.location.reload();
		  },
		  cancellation:()=>{
		    Modal.confirm('此操作将永久删除您的账号及数据, 点击确定后实时生效，是否继续?', '重要提示', {
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning'
		    }).then(() => {
		      this.$api.cancelAccount().then(res => {
		        if(res.success){
		          this.$message({
		            type: 'success',
		            message: '注销成功!'
		          });
		          localStorage.clear();
		          window.location.reload();
		        }else{
		          this.$message({
		            type: 'warning',
		            message: res.message
		          });
		        }
		      })
		    })
		  },
		  resetSetting:()=>{
		  },
	  }

    methods.initDateConfig();
    const visible = data.visible
	  expose({
	  	visible
	  })
    return {showTime,...data, ...methods,afterVisibleChange}
  },
  // created() {
  // },
  // watch:{
  //   drawer(value){
  //     if(!value){
  //       return;
  //     }
  //     let dateTimeConfig = localStorage.getItem('dateTimeConfig')
  //     if (dateTimeConfig) {
  //       this.dateTimeConfig = JSON.parse(dateTimeConfig);
  //     }else{
  //       localStorage.setItem('dateTimeConfig', JSON.stringify(this.dateTimeConfig)) ;//将lang 语言存在localStorage里
  //     }
  //     this.currentLanguage = localStorage.getItem('language')||'zh_cn';
  //     this.showNavBar = this.$store.state.settings.showNavBar;
  //   }
  // },
}
</script>
<style lang="less" scoped>
:deep .a-menu {
  border-right: none;
  background: none!important;
  .a-menu-item:not(.is-active){
    color: rgba(var(--img-text), 1);
    padding: 0 0 0 5px!important;
  }
  .a-menu-item.is-active{
    //color: var(--color-primary);
  }
  .a-menu-item:hover,.a-menu-item:focus{
    background-color: var(--bg-hover);
  }
}
</style>
<style lang="less" >

/* <768px */
@media screen and (max-width:768px) {
  .a-drawer {
    width:100%!important;
    left:0;
  }
}
.a-drawer{
  // background: url("background.jpg");
}
.ant-drawer-body{
  padding:0!important;
  background-color: rgba(var(--alpha-bg), var(--sidebar-opacity, .9));
}
.ant-menu-vertical .ant-menu-item{
  padding: 0 0 0 10px!important;
}
.settingItem{
  padding:10px;
  margin-top:10px;
  background-color: var(--bg-info);
  border-radius: 10px;
  margin-right:10px;
  .title{
    color: rgba(var(--img-text), 1);
    font-size:14px;
    line-height:20px;
    margin-top:10px;
  }
  .content{
    color: rgba(var(--img-text), 1);
    margin-top:10px;
    font-size:14px;
    // button{
    //   font-size:13px;
    //   padding:8px;
    //   min-width:60px;
    //   margin-top:10px;
    // }
    .feedback{
      color: #46a6ff;
    }
    .aboutus{
      margin-top:10px;
      a{
        color: #46a6ff;
        display: inline-flex;
        flex-direction: column;
        margin-bottom:10px;
        margin-right:15px;

      }
    }
  }
  .a-switch__label{
    color: rgba(var(--img-text), 1);
  }
}
.dateTimeFormat{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}
.dateTimeOtherSetting{
  margin-top:10px;
}
.iconStyle {
  display: flex;
  flex-direction: row;

  .colorIcon {
    height: 20px;
    width: 20px;
    border-radius: 10px;
    margin-top: 8px;
    margin-right: 10px;
  }
}
</style>
