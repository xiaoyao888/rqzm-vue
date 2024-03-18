<template>
  <a-modal v-model:visible="data.visible" class="dialogWidth" width="980px" style="top: 20px" :title="$t('action.todoList')" :footer="null">
    <div class="vuex-list">
      <a-input
          ref="inputRef"
          v-model:value="data.inputValue"
          style="width:50%;"
          type="text"
          placeholder="请输入最新待办事务"
          @keyup.enter.native="addItem"
      />
      <a-button type="primary" @click="addItem" style="margin-left:10px;">添加</a-button>
      <a-button type="primary" @click="exportExcelVisible()" style="margin-left:10px;">导出</a-button>
      <span v-if="data.exportVisible" class="exportDate">
        <a href="javascript:void(0)" @click="exportTodoList(1)">最近一周</a>
        <a href="javascript:void(0)" @click="exportTodoList(2)">最近一月</a>
        <a href="javascript:void(0)" @click="exportTodoList(3)">全部</a>
      </span>
      <a-menu mode="horizontal" v-model:selectedKeys="current"  @select="handleSelect">
        <a-menu-item :key="1"><a>全部({{ data.todoList.length }})</a></a-menu-item>
        <a-menu-item :key="2"><a>未完成({{ uncompletedList().length }})</a></a-menu-item>
        <a-menu-item :key="3"><a>已完成({{ completedList().length }})</a></a-menu-item>
      </a-menu>

      <div class="container">
        <div v-for="todo in currentList.value" :key="todo.id" class="card">
          <div class="content">
            <Icon :icon="'CheckCircleFilled'" style="font-size:28px;" @click.prevent="changeItemValue(todo)"/>
            <Icon :icon="'CloseCircleFilled'" style="font-size:28px;margin-left:10px;" @click.prevent="delItemVue(todo)"/>
            <input
                v-if="todo.completed===1"
                v-model.trim="todo.title"
                class="inputList"
                style="text-decoration:line-through"
                type="text"
                @keydown.enter="updateItem(todo)"
                @blur="updateItem(todo)"
            >
            <input
                v-else
                v-model.trim="todo.title"
                class="inputList"
                type="text"
                @keydown.enter="updateItem(todo)"
                @blur="updateItem(todo)"
            >
            <div v-if="todo.completed===1" class="completedTime">{{ todo.completedTime }}</div>

            <div v-if="data.activeIndex===2" class="completedTime">{{ todo.createDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {formatDate, diff, exportExcel, deepClone, uuid} from '@/utils/util'
import crypto from '@/utils/crypto'
import {ref,defineExpose, reactive} from "vue";
import Icon from '@/components/icon'
import {Modal} from "ant-design-vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const current = ref([2])
const data = reactive({
  exportVisible: false,
  visible: false,
  defaultIndex: 2,
  activeIndex: 2,
  todoList: [],
  inputValue: ''
})

const currentList = reactive([])

const completedList = () => {
  return data.todoList.filter(todo => {
    return todo.completed === 1
  })
}
const uncompletedList = () => {
  return data.todoList.filter(todo => {
    return todo.completed === 0
  })
}
const exportExcelVisible = () => {
  data.exportVisible = !data.exportVisible
}

const exportTodoList = (value) => {
  const td = deepClone(data.todoList)
  let todoList = []
  if (value === 1) {
    todoList = td.filter(todo => {
      const days = diff(new Date(), new Date(todo.createDate))
      return days < 7
    })
  } else if (value === 2) {
    todoList = td.filter(todo => {
      return diff(new Date(), new Date(todo.createDate)) < 30
    })
  } else {
    todoList = td
  }
  const wscols = [ // 每列不同宽度px
    {wch: 20},
    {wch: 40},
    {wch: 20},
    {wch: 20},
    {wch: 20}
  ]
  exportExcel(todoList, {
    'id': '编号',
    'title': '标题',
    'completedName': '是否完成',
    'completedTime': '完成时间',
    'createDate': '创建日期'
  }, '待办事项导出Excel文档', wscols)
}
const addItem = () => {
  if (data.inputValue === '') {
    return
  }
  let item = {
    id: uuid(true),
    title: data.inputValue,
    completed: 0,
    completedName: '未完成',
    completedTime: null,
    createDate: formatDate(new Date())
  };
  if (localStorage.getItem("userInfo")) {
    item.sign = crypto.encrypt(JSON.stringify(item));
    // this.$api.saveTodo({sign: item.sign}).then(res => {
    //   if (res.success) {
    //     // console.log("保存成功")
    //   }
    // })
  }
  data.todoList.push(item)
  localStorage.setItem('todoList', JSON.stringify(data.todoList))
  getCurrentTodoList()
  data.inputValue = ''
}
const updateItem = (item) => {
  if (item.title === '') {
    return
  }
  let todoList = localStorage.getItem('todoList') || []
  if (todoList) {
    if (todoList.length > 0) {
      todoList = JSON.parse(todoList)
    }
    todoList = todoList.map(todo => {
      if (todo.id === item.id) {
        todo.title = item.title
      }
      return todo
    })

    if (localStorage.getItem("userInfo")) {
      item.sign = crypto.encrypt(JSON.stringify(item));
      // this.$api.updateTodo({sign: item.sign}).then(res => {
      //   if (res.success) {
      //     console.log("保存成功")
      //   }
      // })
    }
    localStorage.setItem('todoList', JSON.stringify(todoList))
    data.todoList = todoList
    getCurrentTodoList()
  }
}
const handleSelect = (item) => {
  current.value[0] = item.key
  getCurrentTodoList()
}
const getCurrentTodoList = () => {
  if(current.value[0] === 1){
    currentList.value = data.todoList
  }else if(current.value[0] === 2){
    currentList.value = uncompletedList()
  }else{
    currentList.value = completedList()
  }
}
const loadTodoList = () => {
  let todoList = localStorage.getItem('todoList') || []
  if (todoList) {
    if (todoList.length > 0) {
      todoList = JSON.parse(todoList)
    }
    data.todoList = todoList
    getCurrentTodoList()
  }
}
const changeItemValue = (item) => {
  let todoList = localStorage.getItem('todoList') || []
  if (todoList) {
    if (todoList.length > 0) {
      todoList = JSON.parse(todoList)
    }
    todoList = todoList.map(todo => {
      if (todo.id === item.id) {
        todo.completed = todo.completed === 1 ? 0 : 1
        todo.completedName = todo.completed === 1 ? '已完成' : '未完成'
        todo.completedTime = formatDate(new Date())
      }
      return todo
    })

    if (localStorage.getItem("userInfo")) {
      item.sign = crypto.encrypt(JSON.stringify(item));
      // this.$api.updateTodo({sign: item.sign}).then(res => {
      //   if (res.success) {
      //     console.log("保存成功")
      //   }
      // })
    }

    localStorage.setItem('todoList', JSON.stringify(todoList))
    data.todoList = todoList
    getCurrentTodoList()
  }
}
const delItemVue = (item) => {
  Modal.confirm({
    title: t('common.confirmDelete'),
    icon: Icon("ExclamationCircleOutlined"),
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise((resolve) => {
        let todoList = localStorage.getItem('todoList') || []
        if (todoList) {
          if (todoList.length > 0) {
            todoList = JSON.parse(todoList)
            todoList = todoList.filter(todo => {
              return todo.id !== item.id
            })
          }
          if (localStorage.getItem("userInfo")) {
            item.sign = crypto.encrypt(JSON.stringify({"id": item.id}));
            // this.$api.deleteTodo({sign: item.sign}).then(res => {
            //   if (res.success) {
            //     console.log("保存成功")
            //   }
            // })
          }
          localStorage.setItem('todoList', JSON.stringify(todoList))
          data.todoList = todoList
          getCurrentTodoList()
        }
        resolve();
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {
    },
  });

}
const showModal = () => {
  data.visible = true;
};
loadTodoList()
defineExpose({
  showModal
})
</script>

<style lang="less" scoped>
.ant-menu{
  background: none!important;
}

.container {
  height: 500px;
  overflow: auto;
}

.content {
  padding: 10px;
  display: flex;
  border-bottom: 1px solid #ccc;

  i {
    color: rgba(var(--img-text), .8);
  }
}

.inputList {
  border: none;
  outline: none;
  font-size: 16px;
  width: 90%;
  height: 30px;
  padding-left: 10px;
  margin-left: 20px;
  color: rgba(var(--img-text), 1);
  background: rgba(var(--bg-card1), 1);
}

.completedTime {
  width: 100px;
  line-height: 30px;
  color: rgba(var(--img-text), 1);
}

.exportDate {
  a {
    margin-left: 10px;
  }
}
</style>
