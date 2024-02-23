<template>
  <div>
    <div class="widget"  :style="'color:'+props.widgetProps.backgroundColor">
      <div class="widget-1x1" v-if="props.widgetProps.size==='1x1'">
        <img :src="require('@/assets/images/logos/' + props.widgetProps.src)" alt=""/>
      </div>
      <div class="widget-2x2" v-if="props.widgetProps.size==='2x2' ">
        <img :src="require('@/assets/images/logos/' + props.widgetProps.src)" alt=""/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from "vue";
const props = defineProps({
  widgetProps: Object
})
</script>

<style lang="less" scoped>
.widget{
  //text-align: center;
}
</style>
