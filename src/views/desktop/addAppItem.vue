<template>
  <a-modal v-model:visible="visible" class="dialogWidth" width="50%" :closable="false" :footer="null">
    <a-row >
      <a-col :span="5" style="border-right: 1px dashed #ccc;">
        <div class="icon" :style="'background: '+form.backgroundColor">
          {{ form.iconWord }}
        </div>
        {{ form.name }}
      </a-col>
      <a-col :span="19" >
        <a-form ref="formFef" :rules="rules" v-bind="data.layout" :model="form">
          <a-form-item label="地址：" prop="url">
            <a-input v-model:value="form.url" placeholder="请输入地址"></a-input>
          </a-form-item>
          <a-form-item label="标题：" prop="name">
            <a-input v-model:value="form.name" placeholder="请输入标题"></a-input>
          </a-form-item>
          <a-form-item label="图标类型：" prop="iconType">
            <a-radio-group v-model:value="value1" button-style="solid" @change="value1===1?form.src='':form.iconWord===''">
              <a-radio-button :value="1">文字</a-radio-button>
              <a-radio-button :value="2">图标</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-if="value1===1" label="图标文字：" prop="iconWord">
            <a-input v-model:value="form.iconWord" placeholder="请输入图标文字"></a-input>
          </a-form-item>
          <a-form-item v-else label="图标地址：" prop="src">
            <a-input v-model:value="form.src" placeholder="请输入图标地址"></a-input>
          </a-form-item>
          <a-form-item label="图标颜色：">
            <div class="iconStyle">
              <div class="colorIcon" v-for="(item, index) in data.colors" :key="index" :style="'background: '+item" @click="methods.selectColor(item)"></div>
              <a-color-picker
                v-model="data.color"
                show-alpha
                :predefine="data.predefineColors">
              </a-color-picker>
            </div>
          </a-form-item>
        </a-form>
        <div class="buttons">
          <a-button type="primary" @click="methods.saveIcon(1)">保存</a-button>
          <a-button type="primary" @click="methods.saveIcon(2)">保存并继续</a-button>
          <a-button @click="visible = false">取消</a-button>
        </div>
      </a-col>
    </a-row>

  </a-modal>
</template>

<script setup>
import {ref,reactive} from "vue";
const visible = ref(false)
const formFef = ref(null)
const value1 = ref(1)
const form = reactive({
  id: Math.random(),
  url: "",
  type: value1.value===1?"text":"icon",
  iconWord: "",
  name: "",
  src: "",
  backgroundColor: "#1681ff",
  size: "1x1"
})
const rules = {
  url: [
    {required: true, message: '地址不能为空', trigger: 'blur'}
  ],
  name: [
    {required: true, message: '标题不能为空', trigger: 'blur'}
  ],
  iconWord: [
    {required: true, message: '图标文字不能为空', trigger: 'blur'}
  ],
  src: [
    {required: true, message: '图标地址不能为空', trigger: 'blur'}
  ],
  backgroundColor: [
    {required: true, message: '图标颜色不能为空', trigger: 'blur'}
  ]
}
const data = {
  layout: {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  },
  colors: ['#1681ff', '#2ecc71', '#33c5c5', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'],
  color: 'rgba(255, 69, 0, 0.68)',
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
}
const methods = {
  selectColor(value) {
    form.backgroundColor = value;
  },
  saveIcon(item) {
    formFef.value.validate().then((valid) => {
      if (valid) {
        let iconDefaultData = localStorage.getItem('iconDefaultData') || []
        if (iconDefaultData) {
          if (iconDefaultData.length > 0) {
            iconDefaultData = JSON.parse(iconDefaultData);
          }
          iconDefaultData[0].children.push(form);
          localStorage.setItem("iconDefaultData", JSON.stringify(iconDefaultData))
          // emit("ok")
        }
        if (item === 1) {
          visible.value = false;
        } else {
          visible.value = true;
        }
        // this.$api.articleSave(this.article).then(res => {
        //   if (res.result) {
        //     this.$message({
        //       type: 'success',
        //       message: res.info
        //     })
        //     this.dialogStatus = 'create'
        //     this.dialogFormVisible = false
        //     this.fetchData()
        //   }
        // })
      }
    }).catch(error => {
      console.log('error', error);
    });

  },
  resetForm() {
    this.$refs['form'].resetFields()
    this.form = {
      "id": "",
      "url": "",
      "type": "text",
      "iconWord": "",
      "name": "",
      "src": "",
      "backgroundColor": "#1681ff",
      "size": "1x1"
    }
  },
}
const showModal=()=>{
  visible.value = true
}
defineExpose({
  showModal
})
</script>

<style lang="less" scoped>
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
  color: #fff;
  font-size: 16px;
}
.buttons{
  text-align:center;
  button{
    margin-right:10px;
  }
}
</style>
