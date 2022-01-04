const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Webpack = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  devServer: {
    historyApiFallback: true, /* support for react-router  */
    static: './dist',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    })
  ]
});
