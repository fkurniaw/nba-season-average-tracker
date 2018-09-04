const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.bundle.js'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    hot: true,
    port: 3000
  },
  module: {
    rules: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
    ]
  }
};
