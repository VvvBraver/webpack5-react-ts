// webpack.base.js
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)

const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === 'development'; // 是否是开发模式

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'), // 入口文件
  output: {
    filename: 'static/js/[name].[chunkhash:8].js', // 加上[chunkhash:8]
    // filename: 'static/js/[name].js', // 每个输出js的名称
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/' // 打包后文件的公共前缀路径
  },

  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: {
          loader: 'babel-loader',
          options: {
            // 预设执行顺序由右往左,所以先处理ts,再处理jsx
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
  
      // {
      //   test: /.(css|less)$/, //匹配 css和 less 文件
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     'postcss-loader',
      //     'less-loader'
      //   ]
      // },

      {
        test: /.css$/, //匹配所有的 css 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /.less$/, //匹配所有的 less 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },

      // {
      //   test: /.(ts|tsx)$/,
      //   use: 'babel-loader'
      // },
      {
        include: [path.resolve(__dirname, '../src')], // 只对项目src文件的ts,tsx进行loader解析
        test: /.(ts|tsx)$/,
        use: ['thread-loader', 'babel-loader']
      }, // 由于thread-loader不支持抽离css插件MiniCssExtractPlugin.loader 开启多线程也是需要启动时间,大约600ms左右,适合规模比较大的项目。

      {
        test:/.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/images/[name].[contenthash:8][ext]' // 加上[contenthash:8]
          // filename:'static/images/[name][ext]', // 文件输出目录和命名
        },
      },

      {
        test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{
          filename:'static/fonts/[name].[contenthash:8][ext]', // 加上[contenthash:8] 
          // filename:'static/fonts/[name][ext]', // 文件输出目录和命名
        },
      },
      {
        test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{ 
          filename:'static/media/[name].[contenthash:8][ext]', // 加上[contenthash:8]
          // filename:'static/media/[name][ext]', // 文件输出目录和命名
        },
      },



    ]
  },

  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    alias: {
      '@': path.join(__dirname, '../src')
    },

    // 如果用的是pnpm 就暂时不要配置这个，会有幽灵依赖的问题，访问不到很多模块。
    modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
    })
  ],

  cache: {
    type: 'filesystem', // 使用文件缓存
  },




}
