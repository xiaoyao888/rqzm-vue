const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
    proxy:{
      '/todayEnglish':{
        // 需要代理的后端接口
        target: 'http://sentence.iciba.com/',
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        //非HTTPS
        secure: false,

        // 替换target中的请求地址，也就是说/myapi=/target，
        //请求target这个地址的时候直接写成/api即可。
        pathRewrite:{'^/todayEnglish': '' }
      },
      '/todaySentence':{
        // 需要代理的后端接口
        target: 'https://v1.hitokoto.cn/',
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        //非HTTPS
        secure: false,

        // 替换target中的请求地址，也就是说/myapi=/target，
        //请求target这个地址的时候直接写成/api即可。
        pathRewrite:{'^/todaySentence': '' }
      },

    }
  }
})
