<template>
  <div>
    <div class="widget a-button--primary" v-if="props.size==='1x1'">
      <div class="widget-1x1">
        <span class="c2" style="vertical-align: middle">{{nowDate}}</span>
      </div>
    </div>

    <div class="widget a-button--primary" v-if="props.size==='1x2'">
      <div class="widget-1x2">
        <div class="c2"><span>{{nowDate + " "+nowWeek+" "+nowLunar}}</span></div>
      </div>
    </div>
    <div class="widget a-button--primary" v-if="props.size==='2x1'">
      <div class="widget-2x1">
        <div class="c1">{{ nowYearMonth }}</div>
        <div class="c2"><span>{{nowDate}}</span></div>
        <div class="c3">{{nowWeek}}</div>
        <div class="c3">{{nowLunar}}</div>
      </div>
    </div>
    <div class="widget a-button--primary" v-if="props.size==='2x2'">
      <div class="widget-2x2">
        <div class="c1">{{ nowYearMonth }}</div>
        <div class="c2"><span>{{nowDate}}</span></div>
        <div class="c3">{{nowLunar + " " + nowWeek}}</div>
      </div>
    </div>
    <div class="widget a-button--primary" v-if="props.size==='2x4'">
      <div class="widget-2x2">
        <div class="c1">{{ nowYearMonth }}</div>
        <div class="c2"><span>{{nowDate}}</span></div>
        <div class="c3">{{nowLunar + " " + nowWeek}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {dateFormat, diff, parseTime} from "@/utils/util";
import {getLunar} from "@/utils/getLunar";
import {reactive, toRefs} from "vue";
import {useI18n} from "vue-i18n";

export default {
  name: "calendar-widget",
  props:['size'],
  setup(props){
    const {locale} = useI18n()
    const data = reactive({
      nowYearMonth: '',
      nowDate: '',
      nowWeek: '',
      nowLunar: ''
    })
    const methods = {
      initCalendar: ()=>{
        let date = new Date();
        // if(data.size==='1x1'){
        //
        // }else if(data.size==='1x2'){
        //
        // }else if(data.size==='2x1'){
        //
        // }else if(data.size==='2x2'){
        //
        // }else if(this.size==='2x4'){
        //
        // }
        data.nowYearMonth = dateFormat("yyyy-MM", date);
        data.nowDate = dateFormat("dd", date);
        data.nowWeek = parseTime(date, '{a}',locale.value)
        data.nowLunar = getLunar(date);
      }
    }
    methods.initCalendar();
    return {
      ...toRefs(data),...methods,props
    }

  }

}
</script>

<style lang="less" scoped>
.widget{
  text-align: center;
}
.widget-1x1{
  .c2{
    line-height:57px;
    font-size:30px;
  }
}
.widget-1x2{
  .c2{
    line-height:57px;
    font-size:14px;
    background:#ff5a5d;
    color:#fff;
  }
}
.widget-2x1{
  .c1{
    margin-top:10px;
    font-size:13px;
  }
  .c2{
    line-height:50px;
    font-size:36px;
  }
  .c3{
    font-size:13px;line-height:30px;
  }
}
.widget-2x2{
  .c1{
    width:100%;
    background:#ff5a5d;
    color:#fff;
    line-height:40px;
  }
  .c2{
    line-height:62px;
    font-size:50px;
    margin-top: 8px;
  }
  .c3{
    font-size:16px;
  }
}
</style>
