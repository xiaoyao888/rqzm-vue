<template>
  <a-modal v-model:visible="visible" class="dialogWidth" width="40%" :title="$t('action.countDown')" :footer="null">
    <div >
      <a-row >
        <a-col :span="7" style="border-right: 1px dashed #ccc;">
          <div class="countdown icon-size-2x2" style="margin:0 auto;width:185px;height:185px" :style="'color:'+formData.textColor">
            <div class="app-icon" :style="'background:'+formData.backgroundColor">
              <div style="width:100%;margin-top:15px;font-size: 18px;" :style="'color:'+formData.textColor">{{ formData.eventName }}</div>
              <div style="margin-top:10px;"><span style="font-size:30px;">{{ days }}</span></div>
              <div style="margin-top:10px;font-size:13px;">{{ formData.targetDate.format("YYYY-MM-DD")  }}</div>
            </div>
            <div class="app-title">{{ formData.widgetName }}</div>
          </div>
        </a-col>
        <a-col :span="17">
          <a-form ref="formRef" :rules="rules" v-bind="layout" :model="formData" label-width="100px" style="margin-left:10px;">
            <a-form-item label="图标名称" name="widgetName">
              <a-input v-model:value="formData.widgetName" max-length="20" type="text" autocomplete="off" tabindex="0"/>
            </a-form-item>
            <a-form-item label="事件名称" name="eventName">
              <a-input v-model:value="formData.eventName" max-length="20" type="text" autocomplete="off" tabindex="0"/>
            </a-form-item>
            <a-form-item label="目标日期/时间" name="targetDate">
              <a-date-picker v-if="formData.eventType === 'countdown'" v-model:value="formData.targetDate" type="datetime" placeholder="选择日期" @change="change" />
              <a-time-picker v-else v-model:value="formData.targetDate" placeholder="选择时间" @change="change"/>
            </a-form-item>
            <a-form-item label="事件类型" name="eventType">
              <a-radio-group v-model:value="formData.eventType" button-style="solid" @change="changeEventType()">
                <a-radio-button value="countdown">倒数日</a-radio-button>
                <a-radio-button value="countdownTime">倒计时</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="背景颜色" name="backgroundColor">
              <div class="iconStyle">
                <div v-for="item in colors" class="colorIcon" :style="'background: '+item" @click="selectBackgroundColor(item)" />
                <color-picker style="margin-top:6px;" @change="changeBackgroundColor" v-model:rgba="formData.backgroundColor"></color-picker>
              </div>
            </a-form-item>
            <a-form-item label="文字颜色" name="textColor">
              <div class="iconStyle">
                <div v-for="item in colors" class="colorIcon" :style="'background: '+item" @click="selectTextColor(item)" />
                <color-picker style="margin-top:6px;" @change="changeTextColor" v-model:rgba="formData.textColor"></color-picker>
              </div>
            </a-form-item>
          </a-form>
          <div style="text-align: center">
            <a-button type="primary" html-type="submit" @click="save" >保存</a-button>
          </div>

        </a-col>
      </a-row>
    </div>

  </a-modal>
</template>

<script>
import {dateFormat, diff, diffHHMMSS} from '@/utils/util'
import {ref,reactive,toRefs} from "vue";
import dayjs from "dayjs";
import Icon from "@/components/icon";
import bus from "@/components/mitt"
export default {
  name: 'Countdown',
  props:['form'],
  components: {
  },
  setup(props,{expose,emit}) {
    const changeTextColor = (e) => {
      console.log(e); // {hex: '#ddd8c3', rgba: 'rgba(221,216,195,0.5849)'}
    }
    const changeBackgroundColor =(e)=>{
      console.log(e)
    }
    const formRef = ref();
    let checkWidgetName = async (_rule, value) => {
      if (!value) {
        return Promise.reject('Please input the widget name');
      }
    };
    const formData = reactive({
      widgetName:'倒数日',
      eventName: '倒数日',
      targetDate: dayjs("2022-07-17"),
      eventType: "countdown",
      backgroundColor: "rgb(0,118,245)",
      textColor:"rgb(255,255,255)"
    })
    const rules = {
      widgetName: [{
        required: true,
        validator: checkWidgetName,
        trigger: 'change',
      }]
    }
    const layout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const data = reactive({
      days: Math.ceil(Math.abs(diff(new Date(), formData.targetDate.toDate()))),
      visible: false,
      appIndex: 0,
      sectionIndex: 0,
      colors: ['#1681ff', '#2ecc71', '#33c5c5', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'],
    })

    const showModal = () => {
      data.visible = true;
    }
    let form = {
      component: "daysMatter",
      name: "",
      nameEn: "Countdown",
      size: "2x2",
      type: "countdown",
      config: {
        name: "倒数日",
        title: "倒数日",
        target: "2022-12-04",
        repeat: "1",
        bgColor: "#2d4f59",
        textColor: formData,
        family: "",
        icon: ""
      },
      id: "da0ebd0b0f2142c7b56827df80d911f7",
      view: null
    }
    const editWidget = (widget,sectionIndex,appIndex)=> {
      formData.widgetName = widget.name
      formData.eventName = widget.config.name
	  if(widget.type==='countdown'){
	      formData.targetDate = dayjs(widget.config.target)
	  }else{
          formData.targetDate = dayjs(dayjs().format("YYYY-MM-DD ")+widget.config.target)
	  }
      formData.eventType = widget.type
      formData.backgroundColor = widget.config.bgColor
      formData.textColor = widget.config.textColor
      form = widget
      data.appIndex = appIndex
      data.sectionIndex = sectionIndex
      methods.initDays(formData.targetDate.toDate())
    }
    let interval = null;
    const methods = {
      changeEventType: ()=>{
        let eventType = formData.eventType;
        if(eventType === 'countdown'){
          formData.widgetName = formData.widgetName.replace("倒计时","倒数日")
          formData.eventName = formData.eventName.replace("倒计时","倒数日")
        }else{
          formData.targetDate = dayjs()
          formData.widgetName = formData.widgetName.replace("倒数日","倒计时")
          formData.eventName = formData.eventName.replace("倒数日","倒计时")

        }
      },
      change:(value)=>{
        methods.initDays(value.toDate())
      },
      initDays:(date)=>{
        let eventType = formData.eventType;
        if(eventType === 'countdown'){
		  clearInterval(interval)
          data.days = Math.ceil(Math.abs(diff(new Date(), date)))
        }else{

          clearInterval(interval)
          data.days = diffHHMMSS(date, new Date())
          interval = setInterval(function(){
            data.days = diffHHMMSS(date, new Date())
          },1000)
        }
      },
      selectTextColor:(value)=> {
        formData.textColor = value
      },
      selectBackgroundColor:(value)=> {
        formData.backgroundColor = value
      },
      save:()=> {
        // this.$refs['formData'].validate((valid) => {
        //   if (valid) {
        formRef.value.validate().then(() => {
            let iconDefaultData = localStorage.getItem('iconDefaultData') || []
            if (iconDefaultData) {
              if (iconDefaultData.length > 0) {
                iconDefaultData = JSON.parse(iconDefaultData)
              }
              form.name = formData.widgetName
              form.config.name = formData.eventName
			  if(form.type === 'countdown'){
				form.config.target = dayjs(formData.targetDate).format("YYYY-MM-DD")
			  }else{
				form.config.target = dayjs(formData.targetDate).format("HH:mm:ss")
			  }
              form.type = formData.eventType
              form.config.bgColor = formData.backgroundColor
              form.config.textColor = formData.textColor
              iconDefaultData[data.sectionIndex].children[data.appIndex] = form
              localStorage.setItem('iconDefaultData', JSON.stringify(iconDefaultData))
              emit("ok", form)
              bus.emit("data",form.config.target)
            }
            data.visible = false
        }).catch(error => {
          console.log('error', error);
        });
        //   }
        // })
      },
      handleFinish: (values) => {
        console.log(values, formState);
      },
      handleFinishFailed: (errors) => {
        console.log(errors);
      },
      handleValidate: (...args) => {
        console.log(args);
      }
    }
    expose({
      editWidget,
      showModal
    })
    return {showModal, formRef,formData,rules,layout,...toRefs(data), ...methods, changeTextColor,changeBackgroundColor}
  },
  // watch: {
  //   textColor(value) {
  //     this.form.config.textColor = value
  //   },
  //   backgroundColor(value) {
  //     this.form.config.bgColor = value
  //   },
  //   dialogVisible() {
  //     if (this.form.config.target) {
  //       this.targetDate = new Date(this.form.config.target)
  //     } else {
  //       this.targetDate = new Date()
  //     }
  //     this.days = Math.ceil(Math.abs(diff(new Date(), new Date(this.form.config.target))))
  //   },
  //   targetDate(value) {
  //     this.form.target = dateFormat('yyyy-MM-dd HH:mm:ss', value)
  //   }
  // },
  // created() {
  // this.form.eventDate = dateFormat('yyyy-MM-dd HH:mm:ss', new Date())
  // this.form.days = diff(new Date(), new Date(this.form.eventDate))
  // },
  // methods: {
// }
}
</script>

<style lang="less" scoped>
:deep .a-form-item {
   margin-bottom: 5px;
  .a-form-item__label{
    color:rgba(var(--img-text),1)
  }
}
.countdown {
  //width: calc(var(--item-size) + var(--item-gap-x));
  //height: calc(var(--item-size) + var(--item-gap-y));
  padding: 0 calc(var(--item-gap-y) / 2) calc(var(--item-gap-x));
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;

  .app-icon {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: var(--icon-bg-radius);
    //background-color: #fff;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      transform: translate3d(-50%, -50%, 0);
      top: 50%;
      left: 50%
    }
  }
  .app-title {
    font-size: 12px;
    color: #000000;
    text-align: center;
    padding-top: 10px;
    white-space: nowrap;
    overflow: hidden;
    //text-overflow: ellipsis
  }
}
.icon-size-2x2,.icon-size-small{
  grid-column:span 2;
  grid-row:span 2;
  width:calc(var(--icon-size) * 2 + var(--icon-gap-y) * 2);
  height:calc(var(--icon-size) * 2 + var(--icon-gap-x) * 2)
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

.icon {
  height: 55px;
  width: 55px;
  text-align: center;
  line-height: 55px;
  border-radius: 15px;
  //color: #fff;
  font-size: 16px;
}
</style>
