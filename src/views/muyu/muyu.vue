<template>
  <div v-cloak>
    <!-- 敲击次数 -->
    <div class="qiaoji" v-show="main">
      <h2>太解压了</h2>
      <h3>我的敲击次数</h3>
      <h1>{{ countTimes }}</h1>
    </div>
    <!-- 功德 -->
    <div class="gongde" :class="{gongdejiayi}">{{ gongde }}</div>
    <!-- 木鱼 -->
    <div class="muyu" :class="{sf}" @click="chuang" v-show="main">
      <img src="./asset/img/muyu.jpg" style="border-radius:30px;" alt="电子木鱼"/>
    </div>
    <audio ref="ding" >
      <source src="./asset/audio/muyu.mp3"/>
    </audio>
  </div>
</template>

<script setup>
import crypto from '@/utils/crypto'
import {ref} from 'vue'

let isclick = true;
let d = new Date().getDay();
const ding = ref()
const main = ref(true)
const countTimes = ref(0)
const sf = ref(false)
const gongdejiayi = ref(false)
const gongde = ref("")

// 敲击次数
const initMyClickTimes = ()=> {
  let count = localStorage.getItem("count");
  let sendMsg = localStorage.getItem("sendMsg");
  if (count == null) {
    count = crypto.encrypt("0");
    localStorage.setItem("count", count);
  }
  let counts = crypto.decrypt(count);
  if (Object.is(Number(counts), NaN)) {
    alert("佛祖面前都作弊，真不怕遭报应啊。");
    main.value = false;
    location.href = "http://www.wchscu.cn/department_sjwk.html"
  }
  if (sendMsg === null) {
    sendMsg = 0;
  } else {
    sendMsg = localStorage.getItem("sendMsg");
  }
  countTimes.value = Number(counts);
  if (counts == null) {
    countTimes.value = 0;
  }
}
const chuang = ()=> {
    if (isclick) {
      gongdejiayi.value = true;
      isclick = false;
      ding.value.play();
      // 疯狂星期寺
      if (d === 4) {
        gongde.value = "功德+2";
      } else {
        gongde.value = "功德+1";
      }

      ding.value.addEventListener("ended", () => {
        isclick = true;
        sf.value = false;
        gongde.value = "";
        gongdejiayi.value = false;
      });
      sf.value = true;
      // 疯狂星期寺
      if (d === 4) {
        countTimes.value += 2;
      } else {
        countTimes.value += 1;
      }
      let str = countTimes.value.toString();
      localStorage.setItem("count", crypto.encrypt(str));
    }
}
const Time = () => {
  // 当前时间
  const date = new Date().getTime();
  // 0点的时间
  let CLEARTIME = localStorage.getItem("CLEARTIME");
  if (date > CLEARTIME) {
    localStorage.setItem("count", crypto.encrypt("0"));
    localStorage.setItem("sendMsg", 0);
    localStorage.setItem("nextDay", false);
  }
}
// 以下是获取当天23点的时间。
const GetFristTime = () =>{
  // 是否到了第二天
  let nextDay = localStorage.getItem("nextDay");
  if (nextDay == null) {
    localStorage.setItem("nextDay", false);
  }
  nextDay = localStorage.getItem("nextDay");
  // 当日23点59分59秒的时间戳
  if (nextDay === "false") {
    getClearTime();
  }
}
const getClearTime = () =>{
  const CLEARTIME = new Date(
      new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1
  ).getTime();
  localStorage.setItem("CLEARTIME", CLEARTIME);
  localStorage.setItem("nextDay", true);
}
const crazyTemple = () =>{
  if (d === 4 && main.value === true) {
    this.$alert(
        "今天是疯狂星期寺活动！功德翻倍！！！",
        "疯狂星期寺",
        {
          confirmButtonText: "确定",
        }
    );
  }
}
document.onkeydown = (e) => {
  if (e.keyCode === 32) {
    chuang()
    // 阻止默认事件
    e.preventDefault()
  }
}
initMyClickTimes();
GetFristTime();
Time();
crazyTemple();
</script>

<style lang="less" scoped>
@media screen and (max-width: 768px) {
  .dialogWidth {
    width: 100% !important;
  }
  ::v-deep .el-dialog {
    width: 100% !important;
  }
}

/* 平板以及手机的尺寸大小 */
body {
  background-color: black;
  color: #fff;
}

.qiaoji {
  padding-top: 100px;
  width: 100%;
  text-align: center;
}

.muyu {
  width: 211px;
  height: 211px;
  margin: 0 auto;
}

.sf {
  animation: suofang 0.3s;
}

.gongde {
  position: absolute;
  left: 80%;
  top: 10%;
  transform: translateX(-50%);
  width: 100px;
  height: 30px;
  font-size: 21px;
}

.gongdejiayi {
  animation: textMove 0.6s;
}

.gongdeList {
  display: flex;
  flex-direction: row;
}

.gongdeLuBox {
  height: 400px;
  border: 1px solid white;
  z-index: 3;
  overflow-y: auto;
}

.gongdeLuBox h1 {
  text-align: center;
}

.userName {
  width: 95%;
  height: 50px;
  line-height: 50px;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #606266;
  border-radius: 5px;
  font-size: 18px;
  margin: 1% auto 0;
  display: flex;
  justify-content: space-between;
  color: white;
}

.userName:nth-child(4) {
  font-size: 25px;
  font-weight: bold;
  color: #000000;
  background-color: #ff9a0a;
}

.userName:nth-child(5) {
  font-size: 23px;
  font-weight: 600;
  color: #000000;
  background-color: silver;
}

.userName:nth-child(6) {
  font-size: 21px;
  font-weight: 500;
  color: #000000;
  background-color: #eebe77;
}

.btns {
  text-align: center;
  margin-top: 20px;
}

.close {
  position: absolute;
  right: 3%;
  top: 1%;
  width: 32px;
  height: 32px;
  background: url("asset/img/关闭.png") no-repeat;
}

.shangchuanGD {
  width: 70%;
  margin: 20% auto 0;
  text-align: center;
}

/* 反馈 */
.feedBack {
  width: 90%;
  margin: 20% auto 0;
}

.feedBack div {
  text-align: center;
}

.version {
  position: absolute;
  right: 8%;
}


/* 木鱼 */
@keyframes suofang {
  50% {
    transform: scale(0.8, 0.8);
  }
  100% {
    transform: scale(1, 1);
  }
}

/* 字体向上消失 */
@keyframes textMove {
  from {
    top: 24%;
    opacity: 1;
  }
  to {
    top: 22%;
    opacity: 0;
  }
}

/* 弹窗出现动画 */
@keyframes showBox {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

[v-cloak] {
  display: none;
}

.el-message-box {
  --el-messagebox-width: 320px;
}
</style>
