const path = require('path');
const webpack = require('webpack');
const HtmlWebpack = require('html-webpack-plugin');
const HtmlWebpackPartials = require('html-webpack-partials-plugin');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const MiniCssExtract = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const env = process.env.NODE_ENV;
const devMode = env !== 'production';

// render page
const page = name => {
  return new HtmlWebpack({
    inject: true,
    template: path.join(__dirname, `./src/pug/${name}.pug`),
    filename: devMode ? `${name}.html` : `../${name}.html`,
  });
};

const config = {
  mode: devMode ? 'development' : 'production',
  entry: {
    app: devMode ? './src/js/app.dev.js' : './src/js/app.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtract({
      path: path.join(__dirname, 'dist'),
      filename: 'css/style.css',
    }),
    new FriendlyErrors(),
    page('index'),
    page('offline'),
    new HtmlWebpackPartials({
      path: './src/partials/tag-manager.html',
      location: 'head',
      priority: 'high',
      options: {
        gtm_property_id: 'GTM-532G58F',
      },
    }),
    new HtmlWebpackPartials({
      path: './src/partials/noscript.html',
      location: 'body',
      priority: 'high',
      options: {
        gtm_property_id: 'GTM-532G58F',
      },
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
          devMode ? 'style-loader' : MiniCssExtract.loader,
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
            },
          },
        ],
      },
    ],
  },
};

module.exports = config;
