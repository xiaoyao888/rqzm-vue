<template>
  <a-modal v-model:visible="visible" class="dialogWidth" width="60%" :footer="null" >
    <div></div>
        <a-calendar v-model="value" :mode="month" :locale="locale">
          <template #headerRender="{ value, type, onChange, onTypeChange }">
            <div class="header">
              {{value.year()}}年{{value.month()+1}}月
                <a-button-group>
                  <a-button type="primary" @click="prev(value, type, onChange, onTypeChange)"><Icon icon="LeftOutlined" ></Icon>上一月</a-button>
                  <a-button type="primary" @click="showToday(value, type, onChange, onTypeChange)">今日</a-button>
                  <a-button type="primary" @click="next(value, type, onChange, onTypeChange)">下一月<Icon icon="RightOutlined"></Icon></a-button>
                </a-button-group>
            </div>
          </template>
          <template #dateCellRender="{ current }">
            <div class="work" v-if="isWork(current)">{{ isWork(current) }}</div>
            <div class="festival">{{ getEvent(current,'festivals') }}</div>
            <div class="lunar" v-if="!getEvent(current,'festivals')" >{{ getEvent(current,'lunar').split("月")[1] }}</div>
          </template>
        </a-calendar>

  </a-modal>
</template>
<script>
import {reactive, toRefs} from "vue";
import {dateFormat} from '@/utils/util'
import Icon from '@/components/icon'
import {useI18n} from "vue-i18n";

const {SolarMonth, HolidayUtil} = require('lunar-javascript')
export default {
  name: 'Canlendar',
  components: {
    Icon,
  },
  setup(prop,{expose}) {
    const {locale} = useI18n()
    const data = reactive({
      value: "",
      visible: false,
      month: 'month',
      currentMonth: null,
      eventList: []
    })
    const showModal = () => {
      data.visible = true;
    };
    const methods = {
      initEventList: (date) => {
        if(!date){
          date = new Date()
        }
        data.currentMonth = date.getMonth()+1
        let mm = SolarMonth.fromDate(date);
        let eventList = []
        for (let day of mm.getDays()) {
          let event = {
            isWork: '',
            lunar:'',
            festivals: []
          }
          let festivals = []
          let lunar = day.getLunar();
          if (lunar.getJieQi()) {
            festivals.push(lunar.getJieQi())
          }
          festivals.push(...day.getFestivals());
          festivals.push(...day.getOtherFestivals());
          festivals.push(...lunar.getFestivals());
          festivals.push(...lunar.getOtherFestivals());

          event.lunar = lunar.toString()
          event.festivals = festivals
          event.date = day.getMonth() +'-'+ (day.getDay())
          eventList.push(event)
        }
        data.eventList = eventList
      },
      isWork: (date)=>{
        let day = dateFormat("yyyy-MM-dd",date.toDate())

        let holiday = HolidayUtil.getHoliday(day);
        if(holiday){
        return holiday.isWork() ? '班' : '休'
        }else {
          return ''
        }
      },
      getEvent: (currentDate,field)=> {
        let date = currentDate.toDate();
        if(data.eventList){
          for (let event of data.eventList) {
            let d1 =(date.getMonth()+1)+'-'+date.getDate();
            if(d1 === event.date){
              if(event[field] && field === 'festivals'){
                return event[field][0]
              }
              if(event[field] && field === 'lunar'){
                return event[field]
              }
            }
          }
        }
        return ''
      },
      prev:(value, type, onChange, onTypeChange)=> {
        let newMonth = value.month(value.month() - 1)
        onChange(newMonth);
        methods.initEventList(newMonth.toDate())
      },
      showToday:(value, type, onChange, onTypeChange)=> {
        let date = new Date();
        let newMonth = value.year(date.getFullYear())
        newMonth = newMonth.month(date.getMonth())
        newMonth = newMonth.date(date.getDate())
        onChange(newMonth);
        methods.initEventList(newMonth.toDate())
      },
      next:(value, type, onChange, onTypeChange)=> {
        let newMonth = value.month(value.month() + 1)
        onChange(newMonth);
        methods.initEventList(newMonth.toDate())
      }
    }
    const visible = data.visible
    expose({
      visible,
      showModal
    })
    methods.initEventList()
    data.value = new Date()
    return {...toRefs(data), locale,...methods,showModal}
  }

}
</script>

<style lang="less" scoped>
.festival{
  text-align:center;
  font-size: 12px;
}
.lunar{
  text-align:center;
  font-size: 12px;
}
.work{
  color: #fff;
  background: #f67e6c;
  top: 0;
  right: 0;
  border-radius: 13px;
  position: absolute;
  font-size: 12px;
  height: 26px;
  width: 26px;
  line-height: 28px;
  text-align: center;
}
:deep .ant-picker-calendar-date-value{
  text-align:center;
  font-size: 20px;
  margin-top: 10px;
}
:deep .ant-picker-calendar-date-content{
  height:30px!important;
}
:deep .ant-picker-calendar-header .ant-picker-calendar-mode-switch{
  display:none;
}
:deep .ant-picker-calendar-header{
  justify-content: flex-start!important;
}
.ant-btn-group{
  margin-left:260px;
}

</style>
