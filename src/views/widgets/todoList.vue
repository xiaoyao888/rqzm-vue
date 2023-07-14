<template>
  <a-modal v-model:visible="visible" class="dialogWidth" width="80%" :title="$t('action.todoList')" :footer="null">
    <div class="vuex-list">
      <a-input
        ref="inputRef"
        v-model.trim="inputValue"
        style="width:600px;"
        type="text"
        placeholder="请输入最新待办事务"
        @keyup.enter.native="addItem"
      />
      <a-button type="primary" @click="addItem">添加</a-button>
      <a-button type="primary" @click="exportExcelVisible()">导出</a-button>
      <span v-if="exportVisible" class="exportDate">
        <a href="javascript:void(0)" @click="exportTodoList(1)">最近一周</a>
        <a href="javascript:void(0)" @click="exportTodoList(2)">最近一月</a>
        <a href="javascript:void(0)" @click="exportTodoList(3)">全部</a>
      </span>
      <a-menu mode="horizontal" :default-active="defaultIndex" @select="handleSelect">
        <a-menu-item index="1"><a>全部({{ todoList.length }})</a></a-menu-item>
        <a-menu-item index="2"><a>未完成({{ uncompletedList.length }})</a></a-menu-item>
        <a-menu-item index="3"><a>已完成({{ completedList.length }})</a></a-menu-item>
      </a-menu>

      <div class="container">
        <div v-for="todo in currentList" :key="todo.id" class="card">
          <div class="content">
            <i class="el-icon-circle-check" style="font-size:32px;" @click.prevent="changeItemValue(todo)" />
            <i class="el-icon-circle-close" style="font-size:32px;" @click.prevent="delItemVue(todo)" />

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

            <div v-if="activeIndex==='2'" class="completedTime">{{ todo.createDate }}</div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { formatDate, diff, exportExcel, deepClone, uuid } from '@/utils/util'
import crypto from '@/utils/crypto'
export default {
  name: 'VuexList',
  data() {
    return {
      exportVisible: false,
      dialogVisible: false,
      defaultIndex: '2',
      activeIndex: '2',
      todoList: [],
      currentList: [],
      inputValue: ''
    }
  },
  computed: {
    completedList() {
      return this.todoList.filter(todo => {
        return todo.completed === 1
      })
    },
    uncompletedList() {
      return this.todoList.filter(todo => {
        return todo.completed === 0
      })
    }
  },
  created() {
    this.loadTodoList()
  },
  methods: {
    exportExcelVisible() {
      this.exportVisible = !this.exportVisible
    },
    exportTodoList(value) {
      const td = deepClone(this.todoList)
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
        { wch: 20 },
        { wch: 40 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ]
      exportExcel(todoList, { 'id': '编号', 'title': '标题', 'completedName': '是否完成', 'completedTime': '完成时间', 'createDate': '创建日期' }, '待办事项导出Excel文档', wscols)
    },
    addItem() {
      if (this.inputValue === '') { return }
      let item = {
        id: uuid(true),
        title: this.inputValue,
        completed: 0,
        completedName: '未完成',
        completedTime: null,
        createDate: formatDate(new Date())
      };
      if(localStorage.getItem("userInfo")){
        item.sign = crypto.encrypt(JSON.stringify(item));
        this.$api.saveTodo({sign:item.sign}).then(res => {
          if(res.success){
            // console.log("保存成功")
          }
        })
      }
      this.todoList.push(item)
      localStorage.setItem('todoList', JSON.stringify(this.todoList))
      this.getCurrentTodoList()
      this.inputValue = ''
    },
    updateItem(item) {
      if (item.title === '') { return }
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

        if(localStorage.getItem("userInfo")){
          item.sign = crypto.encrypt(JSON.stringify(item));
          this.$api.updateTodo({sign:item.sign}).then(res => {
            if(res.success){
              console.log("保存成功")
            }
          })
        }
        localStorage.setItem('todoList', JSON.stringify(todoList))
        this.todoList = todoList
        this.getCurrentTodoList()
      }
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key
      this.getCurrentTodoList()
    },
    getCurrentTodoList() {
      switch (this.activeIndex) {
        case '1' :
          this.currentList = this.todoList
          break
        case '2' :
          this.currentList = this.uncompletedList
          break
        case '3' :
          this.currentList = this.completedList
          break
      }
    },
    loadTodoList() {
      let todoList = localStorage.getItem('todoList') || []
      if (todoList) {
        if (todoList.length > 0) {
          todoList = JSON.parse(todoList)
        }
        this.todoList = todoList
        this.getCurrentTodoList()
      }
    },
    changeItemValue(item) {
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

        if(localStorage.getItem("userInfo")){
          item.sign = crypto.encrypt(JSON.stringify(item));
          this.$api.updateTodo({sign:item.sign}).then(res => {
            if(res.success){
              console.log("保存成功")
            }
          })
        }

        localStorage.setItem('todoList', JSON.stringify(todoList))
        this.todoList = todoList
        this.getCurrentTodoList()
      }
    },
    delItemVue(item) {
      let todoList = localStorage.getItem('todoList') || []
      if (todoList) {
        if (todoList.length > 0) {
          todoList = JSON.parse(todoList)
          todoList = todoList.filter(todo => {
            return todo.id !== item.id
          })
        }
        if(localStorage.getItem("userInfo")){
          item.sign = crypto.encrypt(JSON.stringify({"id":item.id}));
          this.$api.deleteTodo({sign:item.sign}).then(res => {
            if(res.success){
              console.log("保存成功")
            }
          })
        }
        localStorage.setItem('todoList', JSON.stringify(todoList))
        this.todoList = todoList
        this.getCurrentTodoList()
      }
    },
  }
}
</script>

<style lang="less" scoped>
:deep .el-dialog{
  .el-dialog__title{
    color: rgba(var(--img-text), 1);
  }
}
:deep .el-dialog__body{
  padding: 5px 20px;
}
.el-menu {
  border-right: none;
  background: none;
  .el-menu-item{
    color: rgba(var(--img-text), 1);
  }
  .el-menu-item.is-active{
    color: #1890ff;
  }
  .el-menu-item:hover,.el-menu-item:focus{
    color: rgba(var(--img-text), 1);
    background-color: var(--bg-hover);
  }

}
.container{
  height:500px;
  overflow: auto;
}
.content{
  padding:10px;
  display: flex;
  border-bottom: 1px solid #ccc;
  i{
    color: rgba(var(--img-text), .8);
  }
}
.inputList{
  border:none;
  outline:none;
  font-size:16px;
  width: 90%;
  height: 30px;
  padding-left: 10px;
  margin-left: 20px;
  color: rgba(var(--img-text), 1);
  background: rgba(var(--bg-card1),1);
}
.completedTime{
  width:100px;
  line-height:30px;
  color: rgba(var(--img-text), 1);
}
.exportDate{
  a{
    margin-left:10px;
  }
}
</style>
