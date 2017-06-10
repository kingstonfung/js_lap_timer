const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const isProd = (process.env.NODE_ENV === 'production');

function getPlugins() {
  var plugins = (isProd) ? [new UglifyJSPlugin()] : [];
  var envStr = (isProd) ? '"production"' : '"development"';
  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': envStr,
    DEVELOPMENT: !isProd,
    DEBUG: !isProd,
  }));
  return plugins;
}

function getExportPath() {
  return (isProd) ? 'release' : 'build';
}

module.exports = {
  entry: {
    js_timer: ['./app/main.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, getExportPath())
  },
  plugins: getPlugins()
};
