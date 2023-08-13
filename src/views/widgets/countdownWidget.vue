<template>
  <div>
    <div class="widget" v-if="size==='1x1'" :style="'color:'+form.config.textColor">
      <div class="widget-1x1">
        <div v-if="form.component === 'countdown'">{{days===0?'休息时间':days}}</div>
        <div v-else style="font-size:12px;">{{days===0?'休息时间':days}}</div>
      </div>
    </div>

    <div class="widget" v-if="size==='1x2'" :style="'color:'+form.config.textColor">
      <div class="widget-1x2">
        <!-- <div style="width:100%;margin-top:20px;" :style="'color:'+form.config.textColor">{{ form.config.name }}</div> -->
        <div style="margin-top:5px;"><span style="font-size:28px;">{{days===0?'休息时间':days}}</span></div>
        <!-- <div style="margin-top:20px;font-size:13px;">{{form.config.target}}</div> -->
      </div>
    </div>
    <div class="widget" v-if="size==='2x1'" :style="'color:'+form.config.textColor">
      <div class="widget-2x1">
        <div v-if="form.component === 'countdownTime'">
          <div v-if="days===0" style="font-size:28px;line-height:32px;padding:10px 0;">休息时间</div>

          <div v-else-if="days.indexOf(':')!==-1" style="margin-top:2px;" v-for="(item,index) in days.split(':')" :key="index">
            <span style="font-size:30px;">{{item}}</span>
          </div>
        </div>
        <div style="margin-top:50px;" v-else ><span style="font-size:30px;">{{days}}</span></div>
      </div>
    </div>
    <div class="widget" v-if="size==='2x2' " :style="'color:'+form.config.textColor">
      <div class="widget-2x2">
        <div v-if="days===0">
          <img style="margin-top:15px;" src="@/assets/images/9e7ld939d.png" alt="休息时间">
        </div>
        <div v-else>
          <div style="width:100%;margin-top:15px;" :style="'color:'+form.config.textColor">{{ form.config.name }}</div>
          <div style="margin-top:10px;"><span style="font-size:30px;">{{days}}</span></div>
          <div style="margin-top:10px;font-size:13px;">{{form.config.target}}</div>
        </div>
      </div>
    </div>
    <div class="widget" v-if="size==='2x4'" :style="'color:'+form.config.textColor">
      <div class="widget-2x2">
        <div v-if="days===0" >
          <img style="margin-top:15px;" src="@/assets/images/9e7ld939d.png" alt="休息时间">
        </div>
        <div v-else>
          <div style="width:100%;margin-top:15px;" :style="'color:'+form.config.textColor">{{ form.config.name }}</div>
          <div style="margin-top:10px;"><span style="font-size:30px;">{{days}}</span></div>
          <div style="margin-top:10px;font-size:13px;">{{form.config.target}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {diff, diffHHMMSS} from "@/utils/util";
import {reactive, toRefs} from "vue";
import dayjs from "dayjs";
import bus from "@/components/mitt"

export default {
  name: "countdown",
  props: ['size','form'],
  setup(props){
    const data = reactive({
      days: ''
    })
    let interval = null
    const methods = {
      initDays:()=>{
        if(props.form.type === 'component' && props.form.component === 'countdown'){
        let date = dayjs(props.form.config.target).toDate()
          data.days = Math.ceil(Math.abs(diff(new Date(), date)))
        }else{
          clearInterval(interval)
        let date = dayjs(dayjs().format("YYYY-MM-DD ")+props.form.config.target).toDate()
          data.days = diffHHMMSS(date, new Date())
          interval = setInterval(function(){
            data.days = diffHHMMSS(date, new Date())
          },1000)
        }
      },
    }
	
    methods.initDays()
    
    return {
      ...toRefs(data)
    }
  }
}
</script>

<style lang="less" scoped>
.widget{
  //text-align: center;
}
</style>
