<template>
  <div>
    <div class="widget" v-if="size==='1x1'" :style="'color:'+form.config.textColor">
      <div class="widget-1x1">
        {{days}}
      </div>
    </div>

    <div class="widget" v-if="size==='1x2'" :style="'color:'+form.config.textColor">
      <div class="widget-1x2">
        <div style="width:100%;margin-top:20px;" :style="'color:'+form.config.textColor">{{ form.config.name }}</div>
        <div style="margin-top:20px;"><span style="font-size:30px;">{{days}}</span></div>
        <div style="margin-top:20px;font-size:13px;">{{form.config.target}}</div>
      </div>
    </div>
    <div class="widget" v-if="size==='2x1'" :style="'color:'+form.config.textColor">
      <div class="widget-2x1">
        <div style="width:100%;margin-top:20px;" :style="'color:'+form.config.textColor">{{ form.config.name }}</div>
        <div style="margin-top:20px;"><span style="font-size:30px;">{{days}}</span></div>
        <div style="margin-top:20px;font-size:13px;">{{form.config.target}}</div>
      </div>
    </div>
    <div class="widget" v-if="size==='2x2'" :style="'color:'+form.config.textColor">
      <div class="widget-2x2">
        <div style="width:100%;margin-top:15px;" :style="'color:'+form.config.textColor">{{ form.config.name }}</div>
        <div style="margin-top:10px;"><span style="font-size:30px;">{{days}}</span></div>
        <div style="margin-top:10px;font-size:13px;">{{form.config.target}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {diff} from "@/utils/util";
import {reactive, toRefs} from "vue";

export default {

  name: "countdown",
  props: ['size','form'],
  setup(props){
    const data = reactive({
      days: ''
    })
    data.days = Math.ceil(Math.abs(diff(new Date(props.form.config.target),new Date())));
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
