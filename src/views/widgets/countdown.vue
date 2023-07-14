<template>
  <a-modal v-model:visible="visible" class="dialogWidth" width="60%" :title="$t('action.countDown')" :footer="null">
    <div class="d-layout-content ml50" data-v-b9c2b6cb="">
      <div class="countdown icon-size-2x2" style="margin:0 auto;" :style="'color:'+form.config.textColor">
        <div class="app-icon" :style="'background:'+form.config.bgColor">
          <div style="width:100%;margin-top:20px;" :style="'color:'+form.config.textColor">{{ form.config.name }}</div>
          <div style="margin-top:20px;"><span style="font-size:30px;">{{ days }}</span>天</div>
          <div style="margin-top:20px;">{{ form.config.target }}</div>
        </div>
        <div class="app-title">{{ form.name }}</div>
      </div>
      <a-form ref="form" :rules="rules" :model="form" label-width="100px">
        <a-form-item label="图标名称">
          <a-input
            v-model="form.name"
            maxlength="20"
            type="text"
            autocomplete="off"
            tabindex="0"
          />
        </a-form-item>
        <a-form-item label="事件名称">
          <a-input
            v-model="form.config.name"
            maxlength="20"
            type="text"
            autocomplete="off"
            tabindex="0"
          />
        </a-form-item>
        <a-form-item label="目标时间">
          <a-date-picker
            v-model="targetDate"
            type="datetime"
            placeholder="选择时间"
            @change="change"
          />
        </a-form-item>
        <a-form-item label="事件重复">
          <a-input
            v-model="form.iconName"
            maxlength="20"
            type="text"
            autocomplete="off"
            tabindex="0"
          />
        </a-form-item>
        <a-form-item label="背景颜色">
          <div class="iconStyle">
            <div v-for="item in colors" class="colorIcon" :style="'background: '+item" @click="selectBackgroundColor(item)" />
            <a-color-picker
              v-model="backgroundColor"
              show-alpha
              :predefine="predefineColors"
            />
          </div>
        </a-form-item>
        <a-form-item label="文字颜色">
          <div class="iconStyle">
            <div v-for="item in colors" class="colorIcon" :style="'background: '+item" @click="selectFontColor(item)" />
            <a-color-picker
              v-model="fontColor"
              show-alpha
              :predefine="predefineColors"
            />
          </div>
        </a-form-item>
      </a-form>
      <div style="text-align: center">
        <a-button type="primary" @click="save">保存</a-button>

      </div>
    </div>
  </a-modal>
</template>

<script>
import { dateFormat, diff } from '@/utils/util'
import {reactive,toRefs} from "vue";

export default {
  name: 'Countdown',
  data() {
    const data = reactive({
      form: {
        'component': 'daysMatter',
        'name': '倒计时',
        'size': '2x2',
        'type': 'countdown',
        'config': {
          'name': '节日倒计时',
          'title': '',
          'target': '',
          'repeat': 'festival',
          'bgColor': '#2d4f59',
          'textColor': '#ffffff',
          'family': '',
          'icon': ''
        },
        'id': '',
        'view': null
      },
      targetDate: null,
      days: '',
      rules: {
        content: [
          {required: true, message: '榜单标题不能为空', trigger: 'blur'}
        ]
      },
      visible: false,
      appIndex: 0,
      groupIndex: 0,
      colors: ['#1681ff', '#2ecc71', '#33c5c5', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'],
      fontColor: 'rgba(0, 0, 0, 1)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ]
    })
    const methods = {
      change:(value)=>{
        data.form.config.target = dateFormat('yyyy-MM-dd', value)
        data.days = Math.ceil(Math.abs(diff(new Date(), value)))
      },
      selectFontColor:(value)=> {
        data.form.config.textColor = value
      },
      selectBackgroundColor:(value)=> {
        data.form.config.bgColor = value
      },
      save:()=> {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let iconDefaultData = localStorage.getItem('iconDefaultData') || []
            if (iconDefaultData) {
              if (iconDefaultData.length > 0) {
                iconDefaultData = JSON.parse(iconDefaultData)
              }
              iconDefaultData[this.groupIndex].children[this.appIndex] = this.form
              localStorage.setItem('iconDefaultData', JSON.stringify(iconDefaultData))
              this.$emit('ok')
            }
            this.dialogVisible = false
          }
        })
      }
    }
    return {...toRefs(data), ...methods}
  },
  // watch: {
  //   fontColor(value) {
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
