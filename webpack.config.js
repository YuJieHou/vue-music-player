var path = require('path')
var webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {
  return {
    mode: 'development',
    entry: env.lib ? "./packages/vue-music-player/index.js" : "./examples/main.js",
    output: {
        // 打包文件的生成路径
        path: path.resolve(__dirname, env.lib ? "./lib" : "./dist"),
        publicPath: env.lib ? "/lib/" : "/dist/",
        // 打包后生成的文件名
        filename: env.lib ? "vue-music-player.js" : "build.js",
        /**
         * library指定的就是你使用require时引入的模块名
         * 这里便是require(“vue-music-player”)
         */
        library: env.lib ? "vue-music-player" : "",
        /**
         * libraryTarget可以指定打包文件中代码的模块化方式，默认为var，常见有如下几种:
         * commonjs/commonjs2: 将你的library暴露为CommonJS模块
         * amd: 将你的library暴露为amd模块
         * umd: 将你的library暴露为所有的模块定义下都可运行的方式
         * 其中AMD和UMD需要指定library，如果不声明组件库则不能正常运行,
         * 这是为了在浏览器上通过script标签加载时，用AMD模块方式输出的组件库可以有明确的模块名
         */
        libraryTarget: env.lib ? "umd" : "var",
        /**
         * 当使用了 libraryTarget: "umd"，
         * 设置umNamedDefine为true时，
         * 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
         */
        umdNamedDefine: env.lib ? true : false,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.sass$/,
          loaders: ['style', 'css', 'sass']
        },
        {// 添加这个json，解决如上的报错问题
            test: /\.scss$/,
            use: ['style-loader','css-loader', 'sass-loader']
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test:/\.(png|jpg|gif|woff|svg|eot|ttf)\??.*$/,
          use: [{
            loader: "url-loader",
            options:{
              limit: 1024 * 10, //限制打包图片的大小：
              esModule: false //  webpack打包html里面img后src为“[object Module]”
            }
          }]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                attrs: ['img:src', 'img:data-src', 'audio:src'],
                minimize: false,
              }
            }
          ]
        }
      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      },
      extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true,
      proxy: {
        '/r.s': {//匹配根路径
          target: 'http://search.kuwo.cn',  // 后台接口域名
          ws: true,        //如果要代理 websockets，配置这个参数
          secure: false,  // 如果是https接口，需要配置这个参数
          changeOrigin: true,  //是否跨域
          pathRewrite:{
            '^/':''
          }
        }
      }
    },
    performance: {
      hints: false
    },
    plugins: [
      // make sure to include the plugin!
      new VueLoaderPlugin()
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: false,
          }
        })
      ]
    },
    devtool: '#eval-source-map'
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
