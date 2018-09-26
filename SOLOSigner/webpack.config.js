const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    app: ['babel-regenerator-runtime', './index.web.js'],
  },
  output: {
    path: path.resolve(__dirname, 'desktop', 'dist'),
    filename: 'bundle.js',
  },
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          // The 'react-native' preset is recommended to match React Native's packager
          presets: ['react-native'],
          // Re-write paths to import only the modules needed by the app
          plugins: ['react-native-web', "transform-decorators-legacy"] // transform-decorators-legacy for mobx
          //plugins: ['react-native-electron']
        },
        include: [
            path.resolve(__dirname, 'index.web.js'),
            path.resolve(__dirname, 'src'),
            // add package need to compile for compatible with web
            path.resolve(__dirname, './node_modules/react-native-uncompiled'), // unclear
            path.resolve(__dirname, './node_modules/css-mediaquery'),
            path.resolve(__dirname, './node_modules/object-resolve-path'),
            // path.resolve(__dirname, './node_modules/react-native-extended-stylesheet'),
  
            path.resolve(__dirname, './node_modules/react-native-vector-icons'),
            path.resolve(__dirname, './node_modules/react-native-drawer-layout'),
            path.resolve(__dirname, './node_modules/react-native-dismiss-keyboard'),
  
            path.resolve(__dirname, './node_modules/react-navigation'),
            path.resolve(__dirname, './node_modules/react-native-tab-view'),
            path.resolve(__dirname, './node_modules/react-native-safe-area-view'),

            path.resolve(__dirname, './node_modules/react-native-screen'),
            path.resolve(__dirname, './node_modules/react-native-svg'),
            path.resolve(__dirname, './node_modules/react-native-svg-uri'),
            path.resolve(__dirname, './node_modules/react-native-qrcode'),
            path.resolve(__dirname, './node_modules/react-native-qrcode-svg'),
            path.resolve(__dirname, './node_modules/react-native-camera'),
            path.resolve(__dirname, './node_modules/react-native-fs'),
            path.resolve(__dirname, './node_modules/react-native-share'),
            path.resolve(__dirname, './node_modules/realm'),
            path.resolve(__dirname, './node_modules/any-promise'),
            path.resolve(__dirname, './node_modules/react-native-router-flux')
          ],
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      },
      // this one use for display svg with format xml on web
      {
        test: /\.svg$/,
        loader: 'raw-loader'
      }
    ],
  },
  resolve: {
    alias: {
      'react-native': 'react-native-electron',
      'react-native-svg-uri': 'svgs',
      'react-native-svg': 'svgs',
      // 'react-native-svg': 'react-svg-inline',
      //'react-native-fs': 'fs'
    },
    extensions: ['.web.js', '.js', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true)
    })
  ],
  devServer: {
    //contentBase: [path.resolve(__dirname, 'desktop')],
    host: '0.0.0.0',
    port: 8082
  },
  target: 'electron-renderer',
}
