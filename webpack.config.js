var path = require('path')

var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var dirJS = path.resolve(__dirname, 'app')
var dirHTML = path.resolve(__dirname, 'html')
var dirBUILD = path.resolve(__dirname, 'build')

module.exports = {
  entry: path.resolve(dirJS, 'index.js'),
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  plugins: [
    new CopyWebpackPlugin([
        { from: dirHTML }
    ]),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: 'bundle.js',
    // publicPath: 'dist',
    path: dirBUILD
  }
}
