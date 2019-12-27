const path = require('path');
const webpack = require('webpack');
const HtmlWebpack = require('html-webpack-plugin');
const HtmlWebpackPartials = require('html-webpack-partials-plugin');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const MiniCssExtract = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const env = require('dotenv').config().parsed;
const isDev = process.env.NODE_ENV !== 'production';
const gtm_property_id = env.GTM_ID;
// render page
const page = name => {
  return new HtmlWebpack({
    template: path.join(__dirname, `./src/pug/${name}.pug`),
    filename: isDev ? `${name}.html` : `../${name}.html`,
    minify: false,
    excludeChunks: ['puppet'],
  });
};

const config = {
  mode: isDev ? 'development' : 'production',
  entry: {
    app: isDev ? './src/js/app.dev.js' : './src/js/app.js',
    puppet: './src/puppet/puppet.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  plugins: [
    new Dotenv(),
    new webpack.ProgressPlugin(),
    new FriendlyErrors(),
    new CleanWebpackPlugin(),
    new MiniCssExtract({
      path: path.join(__dirname, 'dist'),
      filename: 'css/[name].css',
    }),
    page('home'),
    page('puppet'),
    page('offline'),
    new HtmlWebpackPartials({
      path: './src/partials/tag-manager.html',
      location: 'head',
      priority: 'high',
      options: { gtm_property_id },
    }),
    new HtmlWebpackPartials({
      path: './src/partials/noscript.html',
      location: 'body',
      priority: 'high',
      options: { gtm_property_id },
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { babelrc: true },
        },
      },
      {
        test: /\.styl(us)?$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtract.loader,
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.(woff2|woff|ttf|eot|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'font/[name].[ext]',
          publicPath: '../',
        },
      },
      {
        test: /.pug$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          {
            loader: 'pug-html-loader',
            options: {
              data: require('./src/data'),
              pretty: true,
            },
          },
        ],
      },
    ],
  },
};

module.exports = config;
