const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const isProd = (process.env.NODE_ENV === 'production');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

function getPlugins() {
  var plugins = (isProd) ? [new UglifyJSPlugin()] : [];
  var envStr = (isProd) ? '"production"' : '"development"';
  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': envStr,
    DEVELOPMENT: !isProd,
    DEBUG: !isProd,
  }));
  plugins.push(new ExtractTextPlugin('js_timer' + getMinFileExtention() + '.css'));
  if (isProd) {
    plugins.push(new OptimizeCssAssetsPlugin());
  }
  return plugins;
}

function getMinFileExtention() {
  return (isProd) ? '.min' : '';
}

function getExportPath() {
  return (isProd) ? 'release' : 'build';
}

module.exports = {
  entry: {
    js_timer: ['./src/main.js']
  },
  output: {
    filename: '[name]' + getMinFileExtention() + '.js',
    path: path.resolve(__dirname, getExportPath())
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ use: 'css-loader' })
      }
    ]
  },
  plugins: getPlugins(),
};
