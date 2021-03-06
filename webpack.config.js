const path = require('path');
const webpack = require('webpack');
const HtmlWebpack = require('html-webpack-plugin');
const HtmlWebpackPartials = require('html-webpack-partials-plugin');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const MiniCssExtract = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const gtm_property_id = 'GTM-532G58F';
// render page
const page = name => {
  return new HtmlWebpack({
    template: path.join(__dirname, `./src/pug/${name}.pug`),
    filename: isDev ? `${name}.html` : `../${name}.html`,
    minify: !isDev,
    inject: true,
    excludeChunks: isDev ? [] : ['playground'],
  });
};

const config = {
  mode: isDev ? 'development' : 'production',
  entry: {
    app: isDev ? './src/js/app.dev.js' : './src/js/app.js',
    playground: './src/playground/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new FriendlyErrors(),
    new CleanWebpackPlugin(),
    new MiniCssExtract({
      path: path.join(__dirname, 'dist'),
      filename: 'css/[name].css',
    }),
    page('index'),
    page('playground'),
    page('offline'),
    page('neomorphism'),
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
