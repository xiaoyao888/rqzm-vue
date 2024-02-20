const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: config => {
    // 生产环境取消 console.log
    if (process.env.NODE_ENV === 'production') {
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'source-map'
    }
  },
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
        target: 'https://tenapi.cn/v2/baiduhot',
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        //非HTTPS
        secure: false,
        // 替换target中的请求地址，也就是说/myapi=/target，
        //请求target这个地址的时候直接写成/api即可。
        pathRewrite:{'^/todaySentence': '' }
      },
      '/baiduhot':{
        // 需要代理的后端接口
        target: 'https://tenapi.cn/v2/baiduhot',
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        //非HTTPS
        secure: false,
        // 替换target中的请求地址，也就是说/myapi=/target，
        //请求target这个地址的时候直接写成/api即可。
        pathRewrite:{'^/baiduhot': '' }
      },
      '/douyinhot':{
        // 需要代理的后端接口
        target: 'https://tenapi.cn/v2/douyinhot',
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        //非HTTPS
        secure: false,
        // 替换target中的请求地址，也就是说/myapi=/target，
        //请求target这个地址的时候直接写成/api即可。
        pathRewrite:{'^/douyinhot': '' }
      },
      '/weibohot':{
        // 需要代理的后端接口
        target: 'https://tenapi.cn/v2/weibohot',
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        //非HTTPS
        secure: false,
        // 替换target中的请求地址，也就是说/myapi=/target，
        //请求target这个地址的时候直接写成/api即可。
        pathRewrite:{'^/weibohot': '' }
      },
      '/zhihuhot':{
        // 需要代理的后端接口
        target: 'https://tenapi.cn/v2/zhihuhot',
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        //非HTTPS
        secure: false,
        // 替换target中的请求地址，也就是说/myapi=/target，
        //请求target这个地址的时候直接写成/api即可。
        pathRewrite:{'^/zhihuhot': '' }
      },
      '/bilihot':{
        // 需要代理的后端接口
        target: 'https://tenapi.cn/v2/bilihot',
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        //非HTTPS
        secure: false,
        // 替换target中的请求地址，也就是说/myapi=/target，
        //请求target这个地址的时候直接写成/api即可。
        pathRewrite:{'^/bilihot': '' }
      },
      '/toutiaohot':{
        // 需要代理的后端接口
        target: 'https://tenapi.cn/v2/toutiaohot',
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
        changeOrigin: true,
        //非HTTPS
        secure: false,
        // 替换target中的请求地址，也就是说/myapi=/target，
        //请求target这个地址的时候直接写成/api即可。
        pathRewrite:{'^/toutiaohot': '' }
      },
    }
  }
})
