var path = require('path');

module.exports = {
  entry: './app/index.js',
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
    ],
  },
  output: {
    filename: 'bundle.js',
    publicPath: 'dist',
    path: path.resolve(__dirname, 'dist')
  }
};
