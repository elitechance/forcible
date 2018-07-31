var path = require('path');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    forcible: './src/forcible.ts'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'awesome-typescript-loader'
    }]
  },
  devServer: {
    port: 3000
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve('dist')
  },
  plugins: [new UglifyJSPlugin()]
};