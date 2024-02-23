import axios from 'axios'
import crypto from "@/utils/crypto";
const baseUrl = process.env.VUE_APP_BASE_API;
// create an axios instance
const service = axios.create({
  baseURL: baseUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/json' //  注意：设置很关键
    }
    const userInfo = localStorage.getItem("userInfo");
    if(userInfo){
      let ui = crypto.decrypt(userInfo);
      config.headers['Authorization'] = JSON.parse(ui).token;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
