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
      <a-row :gutter="20" style="margin:0;height:100%">
        <a-col :span="8" :style="'border-right:1px solid #ccc;padding-right:0;padding-left:0;overflow-x:hidden'">
          <a-menu
              default-active="basicSetting"
              class="a-menu-vertical-demo"
              style="height:100%;"
              @select="handleOpen">
            <a-menu-item key="basicSetting">
              <Icon icon="SettingOutlined"></Icon>
              <span slot="title">{{ $t("action.basicSetting") }}</span>
            </a-menu-item>
            <a-menu-item key="searchBar">
              <i class="a-icon-search"></i>
              <Icon icon="SearchOutlined"></Icon>
              <span slot="title">{{ $t("action.searchBar") }}</span>
            </a-menu-item>
            <a-menu-item key="icon">
              <Icon icon="InfoCircleOutlined"></Icon>
              <span slot="title">{{ $t("common.icon") }}</span>
            </a-menu-item>
            <a-menu-item key="dateTime">
              <Icon icon="ClockCircleOutlined"></Icon>
              <span slot="title">{{ $t("action.dateTime") }}</span>
            </a-menu-item>
            <a-menu-item key="themeWallpaper">
              <Icon icon="FileImageOutlined"></Icon>
              <span slot="title">{{ $t("action.themeWallpaper") }}</span>
            </a-menu-item>
            <a-menu-item key="layout">
              <Icon icon="TableOutlined"></Icon>
              <span slot="title">{{ $t("common.layout") }}</span>
            </a-menu-item>
            <a-menu-item key="backupRecovery">
              <Icon icon="AntCloudOutlined"></Icon>
              <span slot="title">{{ $t("action.backupRecovery") }}</span>
            </a-menu-item>
            <a-menu-item key="about">
              <Icon icon="CrownOutlined"></Icon>
              <span slot="title">{{ $t("action.about") }}</span>
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="16">
          <div class="grid-content bg-purple">
            <div style="color:var(--img-text);font-size:26px;text-align:right;margin-right:10px;margin-top:8px;"
                 @click="drawer=false">
              <i class="a-icon-s-unfold"></i>
            </div>
            <div v-if="menuIndex==='basicSetting'">
              <div class="settingItem">
                <span class="title">{{ $t("action.languageSwitch") }}</span>
                <div class="content">
                  <a-button size="small" :type="currentLanguage === 'zh_cn'?'primary':''" @click="changeLanguage('zh_cn')">
                    {{ $t("action.chinese") }}
                  </a-button>
                  <a-button size="small" :type="currentLanguage === 'en_us'?'primary':''" @click="changeLanguage('en_us')">
                    {{ $t("action.english") }}
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
                <span class="title">{{ $t("action.resetIcon") }}</span>
                <div class="content">
                    <a-button size="small" type="primary" @click="resetIcon()">{{ $t("common.reset") }}</a-button>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("common.accountCancellation") }}</span>
                <div class="content">
                  <a-button size="small" type="primary" @click="cancellation()">{{
                      $t("common.cancellation")
                    }}
                  </a-button>
                </div>
              </div>
            </div>
            <div v-if="menuIndex==='dateTime'">
              <div class="settingItem">
                <span class="title">{{ $t("action.showTime") }}</span>
                <div class="content">
                  <a-switch v-model:checked="showTime" @change="changeDateTime"></a-switch>
                </div>
              </div>
              <div class="settingItem" v-if="showTime">
                <span class="title">{{ $t("action.dateTimeFormat") }}</span>
                <div class="content">
                  <div class="dateTimeFormat">
                    <a-button size="small" effect="dark" :type="dateTimeConfig.format==='yyyy-MM-dd HH:mm:ss'?'primary':''"
                           @click="changeDateFormat('yyyy-MM-dd HH:mm:ss',1000)">年月日时分秒
                    </a-button>
                    <a-button size="small" effect="dark" :type="dateTimeConfig.format==='yyyy-MM-dd HH:mm'?'primary':''"
                           @click="changeDateFormat('yyyy-MM-dd HH:mm',6000)">年月日时分
                    </a-button>
                    <a-button size="small" effect="dark" :type="dateTimeConfig.format==='yyyy-MM-dd'?'primary':''"
                           @click="changeDateFormat('yyyy-MM-dd',1000*60*60*24)">年月日
                    </a-button>
                    <a-button size="small" effect="dark" :type="dateTimeConfig.format==='MM-dd HH:mm'?'primary':''"
                           @click="changeDateFormat('MM-dd HH:mm')">月日 时分
                    </a-button>
                    <a-button size="small" effect="dark" :type="dateTimeConfig.format==='MM-dd'?'primary':''"
                           @click="changeDateFormat('MM-dd')">月日
                    </a-button>
                    <a-button size="small" effect="dark" :type="dateTimeConfig.format==='HH:mm:ss'?'primary':''"
                           @click="changeDateFormat('HH:mm:ss')">时分秒
                    </a-button>
                    <a-button size="small" effect="dark" :type="dateTimeConfig.format==='HH:mm'?'primary':''"
                           @click="changeDateFormat('HH:mm')">时分
                    </a-button>
                  </div>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.dateTimeOtherSetting") }}</span>
                <div class="content">
                  <div class="dateTimeOtherSetting">
                    星期 <a-switch v-model:checked="showWeek" @change="changeWeek"></a-switch>
                  </div>
                  <div class="dateTimeOtherSetting">
                    粗细 <a-switch v-model:checked="showWeight" @change="changeDateWeight"></a-switch>
                  </div>
                  <div class="dateTimeOtherSetting">
                    阴历 <a-switch v-model:checked="showLunar" @change="changeDateLunar"></a-switch>
                  </div>
                  <div class="dateTimeOtherSetting">
                    天/周 <a-switch v-model:checked="showDay" @change="changeDateDay"></a-switch>
                  </div>
                </div>
              </div>
<!--              <div class="settingItem">-->
<!--                <span class="title">{{ $t("action.dateTimeColor") }}</span>-->
<!--                <div class="content">-->
<!--                  <div class="iconStyle">-->
<!--                    <color-picker @ok="selectColor"></color-picker>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
            </div>
            <div v-if="menuIndex==='themeWallpaper'">
              <div class="settingItem">
                <!-- <a-switch v-model="this.$store.state.settings.themeMode==='dark'" :inactive-text="$t('action.darkMode')" @change="changeThemeMode"></a-switch> -->
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.changeThemeColor") }}</span>
                <div class="iconStyle">
                  <div v-for="(item,index) in colors" :key="index" class="colorIcon" :style="'background: '+item"
                       @click="selectThemeColor(item)"/>
                </div>
                <div class="iconStyle" style="margin-top:20px;">
                  <input type="color" :value="colorState.primaryColor" @input="selectThemeColor"/>
                </div>
              </div>
            </div>
            <div v-if="menuIndex==='layout'">
              <div class="settingItem">
                <span class="title">{{ $t("action.showClock") }}</span>
                <div class="content">
                  <a-switch v-model:checked="clockShow" @change="changeClock"></a-switch>
                </div>
              </div>

              <div class="settingItem" v-if="clockShow">
                <span class="title">{{ $t("action.clockStyle") }}</span>
                <div class="content">
                  <a-button-group>
                    <a-button :type="clockStyle ===1?'primary':''" @click="changeStyle(1)">1</a-button>
                    <a-button :type="clockStyle ===2?'primary':''" @click="changeStyle(2)">①</a-button>
                    <a-button :type="clockStyle ===3?'primary':''" @click="changeStyle(3)">一</a-button>
                    <a-button :type="clockStyle ===4?'primary':''" @click="changeStyle(4)">壹</a-button>
                    <a-button :type="clockStyle ===5?'primary':''" @click="changeStyle(5)">Ⅰ</a-button>
                  </a-button-group>
                </div>
              </div>
            </div>
            <div v-if="menuIndex==='about'">
              <div class="settingItem">
                <div class="content">
                  <span>{{ $t("action.version") }}：2.1.1</span>
                </div>
              </div>
              <div class="settingItem">
                <div class="content">
                  <a class="feedback" href="https://support.qq.com/products/451438"
                     target="_blank">{{ $t("action.feedback") }}</a>
                </div>
              </div>

              <div class="settingItem">
                <div class="content">
                  <a class="feedback" href="https://support.qq.com/products/451438/blog/764325" target="_blank">
                    {{ $t("action.thanks") }}
                  </a>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.contactUs") }}</span>
                <div class="content">
                  <div style="text-align: center;height:150px;">
                    <img src="@/assets/images/douyin.jpg" width="150"
                         style="margin-top:10px;border-radius: 10px;"/><br/>
                    {{ $t("action.douyin") }}:qzpenge
                  </div>
                </div>
              </div>
              <div class="settingItem">
                <span class="title">{{ $t("action.aboutUs") }}</span>
                <div class="content">
                  <div class="aboutus">
                    <a href="https://www.rqzm.cn" target="_blank">{{ $t("action.officialWebsite") }}</a>️
                    <a href="https://www.douyin.com/user/MS4wLjABAAAAavVLkpztz9Y8MZIY2nzOnlNQUisa0htTv5bot57ehCw"
                       target="_blank">{{ $t("action.contactUs") }}</a>️
                    <a href="https://support.qq.com/products/451438/blog/765532" target="_blank">{{
                        $t("action.privacy")
                      }}</a>️
                    <a href="https://support.qq.com/products/451438/blog/765533"
                       target="_blank">{{ $t("action.disclaimer") }}</a>️
                    <a href="https://support.qq.com/products/451438/blog/765536"
                       target="_blank">{{ $t("action.updateRecord") }}</a>️
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

<script setup>
import {ref, reactive,defineExpose,defineEmits} from "vue";
import {useI18n} from "vue-i18n";
import Icon from "@/components/icon"
import {Modal, message, ConfigProvider} from "ant-design-vue";
import serviceapi from "@/api/serviceapi";
// import ColorPicker from "@/components/colorPicker";
// import themePicker from "@/components/ThemePicker";
const {t, locale} = useI18n()
let showTime = ref();
const clockShow = ref(false)
const clockStyle = ref(1)
const visible = ref(false)
const themeMode1 = ref('dark')
const themeColor = ref(null)
const menuIndex = ref('basicSetting')
const currentLanguage = ref('zh_cn')
const dateTimeConfig = reactive({
  showTime: true,
  format: "yyyy-MM-dd",
  color: '#000000',
  timestamp: 1000 * 60 * 60 * 2,
  week: true,
  weight: true,
  lunar: true,
  day: true
})
const showWeek = ref(false)
const showWeight = ref(false)
const showLunar = ref(false)
const showDay = ref(false)

const colors = reactive(['#1681ff','#9694FF','#9b59b6','#B96489','#2ecc71', '#33c5c5', '#519090','#275F8A', '#f1c40f', '#e67e22', '#e74c3c','#E0106A'])

const afterVisibleChange = (bool) => {
  initConfig();
};


const themeChange = (value) => {
  themeColor.value = value;
  // this.$store.dispatch('settings/changeSetting', {
  //   key: 'themeColor',
  //   value: value
  // })
}
const initConfig = () => {
  //初始化日期配置
  let dateTimeConfiguration = localStorage.getItem('dateTimeConfig')
  if (dateTimeConfiguration && dateTimeConfiguration.length > 0) {
    dateTimeConfiguration = JSON.parse(dateTimeConfiguration)
    dateTimeConfig.showTime = dateTimeConfiguration.showTime
    dateTimeConfig.format = dateTimeConfiguration.format
    dateTimeConfig.color = dateTimeConfiguration.color
    dateTimeConfig.timestamp = dateTimeConfiguration.timestamp
    dateTimeConfig.week = dateTimeConfiguration.week
    dateTimeConfig.weight = dateTimeConfiguration.weight
    dateTimeConfig.lunar = dateTimeConfiguration.lunar
    dateTimeConfig.day = dateTimeConfiguration.day

    showTime.value = dateTimeConfiguration.showTime
    showWeek.value = dateTimeConfiguration.week
    showWeight.value = dateTimeConfiguration.weight
    showLunar.value = dateTimeConfiguration.lunar
    showDay.value = dateTimeConfiguration.day
  }

  //初始化表配置
  let cc = localStorage.getItem('clockConfig')
  if (cc) {
    let data = JSON.parse(cc)
    clockShow.value = data.show
    clockStyle.value = data.style
  }

  //初始化语言
  let language = localStorage.getItem('language');
  if(language){
    currentLanguage.value = language;
  }
}

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
}*/
const changeLanguage = (lang) => {
  locale.value = lang
  currentLanguage.value = lang
  localStorage.setItem('language', lang);//将lang 语言存在localStorage里
}
const handleOpen = (item) => {
  menuIndex.value = item.key;
}
const changeThemeMode = (bool) => {
  let mode = bool ? "dark" : "light";
  emits('changeThemeMode', mode);
//   // this.$store.dispatch('settings/changeSetting',{
//   //   key: 'themeMode',
//   //   value: mode
//   // })
}

const changeClock = (bool) => {
  clockShow.value = bool
  emits("changeClock", clockShow.value, clockStyle.value)
  let data = {show: clockShow.value, style: clockStyle.value}
  localStorage.setItem('clockConfig', JSON.stringify(data));
}
const changeStyle = (style) => {
  clockStyle.value = style
  emits("changeClock", clockShow.value, clockStyle.value)
  let data = {show: clockShow.value, style: clockStyle.value}
  localStorage.setItem('clockConfig', JSON.stringify(data));
}

const changeDateTime = (bool) => {
  showTime.value = bool
  dateTimeConfig.showTime = bool;
  saveDateSetting()
}
const changeDateFormat = (value, timestamp) => {
  dateTimeConfig.format = value
  dateTimeConfig.timestamp = timestamp
  saveDateSetting()
}
const changeWeek = (bool) => {
  dateTimeConfig.week = bool
  showWeek.value = bool
  saveDateSetting()
}
const changeDateWeight = (bool) => {
  dateTimeConfig.weight = bool
  showWeight.value = bool
  saveDateSetting()
}
const changeDateLunar = (bool) => {
  dateTimeConfig.lunar = bool
  showLunar.value = bool
  saveDateSetting()
}
const changeDateDay = (bool) => {
  dateTimeConfig.day = bool
  showDay.value = bool
  saveDateSetting()
}
// const selectColor = (value) => {
//   dateTimeConfig.color = value
//   saveDateSetting()
// }
const colorState = reactive({
  primaryColor: localStorage.getItem("theme")?localStorage.getItem("theme"):'#1890ff',
});
const selectThemeColor = (value) => {
  if(value instanceof Event){
    value = value.target.value;
  }
  Object.assign(colorState, {
    primaryColor: value,
  });
  ConfigProvider.config({
    theme: colorState,
  });
  localStorage.setItem("theme",value)
}

const saveDateSetting = () => {
  localStorage.setItem('dateTimeConfig', JSON.stringify(dateTimeConfig));
  emits("changeDateTime", dateTimeConfig)
}
// const saveThemeSetting = () => {
//   // this.$emit('changeDateTime', this.dateTimeConfig);
//   localStorage.setItem('dateTimeConfig', JSON.stringify(dateTimeConfig));
// }
const resetIcon = () => {
  let iconDefaultData = require('@/assets/json/navJsonData');
  localStorage.setItem("iconDefaultData", JSON.stringify(iconDefaultData));
  window.location.reload();
}
const cancellation = () => {
  Modal.confirm('此操作将永久删除您的账号及数据, 点击确定后实时生效，是否继续?', '重要提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    serviceapi.cancelAccount().then(res => {
      if (res.success) {
        message.success("注销成功");
        localStorage.clear();
        window.location.reload();
      } else {
        message.warning(res.message);
      }
    })
  })
}
const resetSetting = () => {

}


defineExpose({
  visible
})
const emits = defineEmits(['changeDateTime','changeThemeMode','changeNavbar','changeClock'])

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
//     this.showNavBar = this.$store.state.settings.showNavBar;
//   }
// },

</script>
<style lang="less" scoped>
:deep .a-menu {
  border-right: none;
  background: none !important;

  .a-menu-item:not(.is-active) {
    color: rgba(var(--img-text), 1);
    padding: 0 0 0 5px !important;
  }

  .a-menu-item.is-active {
    //color: var(--color-primary);
  }

  .a-menu-item:hover, .a-menu-item:focus {
    background-color: var(--bg-hover);
  }
}
</style>
<style lang="less">

/* <768px */
@media screen and (max-width: 768px) {
  .a-drawer {
    width: 100% !important;
    left: 0;
  }
}

.a-drawer {
  // background: url("background.jpg");
}

.ant-drawer-body {
  padding: 0 !important;
  background-color: rgba(var(--alpha-bg), var(--sidebar-opacity, .9));
}

.ant-menu-vertical .ant-menu-item {
  padding: 0 0 0 10px !important;
}

.settingItem {
  padding: 0 10px;
  margin-top: 10px;
  background-color: var(--bg-info);
  border-radius: 10px;
  margin-right: 10px;

  .title {
    color: rgba(var(--img-text), 1);
    font-size: 14px;
    line-height: 20px;
    margin-top: 10px;
    font-weight:bold;
  }

  .content {
    color: #898989;
    margin-top: 10px;
    font-size: 12px;
    button{
      margin-right:5px;
    }
    // button{
    //   font-size:13px;
    //   padding:8px;
    //   min-width:60px;
    //   margin-top:10px;
    // }
    .feedback {
      color: #46a6ff;
    }

    .aboutus {
      margin-top: 10px;

      a {
        color: #46a6ff;
        display: inline-flex;
        flex-direction: column;
        margin-bottom: 10px;
        margin-right: 15px;

      }
    }
  }

  .a-switch__label {
    color: rgba(var(--img-text), 1);
  }
}

.dateTimeFormat {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}

.dateTimeOtherSetting {
  margin-top: 10px;
}

.iconStyle {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .colorIcon {
    height: 20px;
    width: 20px;
    border-radius: 10px;
    margin-top: 8px;
    margin-right: 10px;
  }
}
</style>
