import request from '@/utils/request'
import qs from 'qs'

const hostApi = {
  imgUploadFile: '/api/upload/uploadImg',
  generateValidateCode: '/api/auth/generateValidateCode',
  generateLoginImg: '/api/weixin/getWeixinQrCode',
  isScanLogin: '/api/userInfo/isScanLogin',
  cancelAccount: '/api/userInfo/cancelAccount',
  logout: '/api/userInfo/logout',
  getMuyuClickTimes: '/api/muyu/getMuyuClickTimes',
  muyuClick: '/api/muyu/click',
  syncTodoList: '/api/todoList/cancelAccount',
  saveTodo: '/api/todoList/save',
  updateTodo: '/api/todoList/update',
  deleteTodo: '/api/todoList/delete',
}
export default {
  postJsonApi(url, params) {
    return request({
      url: url,
      method: 'post',
      // params: parms
      data: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
  },
  postApi(url, params) {
    const p = url + '?' + qs.stringify(params)
    return request({
      url: p,
      method: 'post'
    })
  },
  getApi(url, params) {
    const p = url + '?' + qs.stringify(params)
    return request({
      url: p,
      method: 'get'
    })
  },
  // ------------------文件上传-----------------------------
  uploadFile(url, formData) {
    return request({
      url: url,
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 240000
    })
  },
  generateValidateCode() {
    return this.getApi(hostApi.generateValidateCode, {})
  },
  importAnchor(formData) {
    return this.uploadFile(hostApi.wenanImport, formData)
  },
  getMuyuClickTimes() {
    return this.postJsonApi(hostApi.getMuyuClickTimes, {})
  },
  muyuClick() {
    return this.postJsonApi(hostApi.muyuClick, {})
  },
  logout() {
    return this.postJsonApi(hostApi.logout, {})
  },
  getToken(params) {
    return this.postApi(hostApi.getToken, params)
  },
  generateLoginImg(params) {
    return this.postJsonApi(hostApi.generateLoginImg, params)
  },
  isScanLogin(params) {
    return this.postJsonApi(hostApi.isScanLogin, params)
  },
  cancelAccount() {
    return this.postJsonApi(hostApi.cancelAccount, {})
  },
  syncTodoList() {
    return this.postJsonApi(hostApi.syncTodoList, {})
  },
  saveTodo(params) {
    return this.postJsonApi(hostApi.saveTodo, params)
  },
  updateTodo(params) {
    return this.postJsonApi(hostApi.updateTodo, params)
  },
  deleteTodo(params) {
    return this.postJsonApi(hostApi.deleteTodo, params)
  }
}
