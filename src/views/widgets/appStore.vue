<template>
  <a-modal v-model:visible="visible" class="dialogWidth" width="50%" :footer="null">
    应用商店正在开发中，敬请期待！
  </a-modal>
</template>

<script setup>
import {ref,defineExpose} from "vue";

const visible = ref(false)
const showModal=()=>{
  visible.value = true
}
defineExpose({
  showModal
})
</script>

<style scoped>

</style>
