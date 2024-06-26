const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { MODE } = require('./library/constants/global');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const glob = require("glob");
const paths = {
 wordpres : path.resolve(__dirname.replace('webpack', ''))
}

let wordpress_files = glob.sync(`${paths.wordpres}/**/*`, { nodir: true }).filter((file) => { 
  let wepback_regex = /webpack/;
  let dist_regex = /dist/;
  if (wepback_regex.test(file) || dist_regex.test(file)) {
    return false;
  }
  return file;
});
 


module.exports = {
  mode: MODE,
  entry: {
    app: path.resolve(__dirname, 'src', 'app', 'js', 'app.js'),
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname.replace('webpack', ''), 'dist'),
    filename: ({ chunk: name }) => {
      return name === 'main'
        ? '[name]-wp[fullhash].js'
        : '[name]/[name]-wp[fullhash].js';
    },
    clean: true,
  },
  module: {
    rules: [
      {
        test: /.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: ({ chunk: { name } }) => {
        return name === 'main'
          ? '[name]-wp[fullhash].css'
          : '[name]/[name]-wp[fullhash].css';
      },
    }),
    new PurgeCSSPlugin({
      paths: wordpress_files
    }),
  ],
  devtool: 'source-map',
};