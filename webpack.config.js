const path = require('path');
const HtmlWebpack = require('html-webpack-plugin');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const ProgressBar = require('progress-bar-webpack-plugin');
const MiniCssExtract = require("mini-css-extract-plugin");

const env = process.env.NODE_ENV;
const production = env === 'production';

// render page
const page = (name) => {
  return new HtmlWebpack({
    inject: true,
    template: path.join(__dirname, `./src/pug/${name}.pug`),
    filename: path.join(__dirname, `${name}.html`)
  });
};

const config = {
  mode: production ? 'production' : 'development',
  entry: {
    app: './src/js/app.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  plugins: [
    new MiniCssExtract({
      path: path.join(__dirname, 'dist'),
      filename: 'css/style.css'
    }),
    new FriendlyErrors(),
    new ProgressBar(),
    page('index')
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 3000
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { babelrc: true }
        }
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.styl(us)?$/,
        use: [
          MiniCssExtract.loader,
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'font/[name].[ext]',
          publicPath: '../'
        }
      },
      {
        test: /.pug$/,
        exclude: /node_modules/,
        loader: [ 'raw-loader', 'pug-plain-loader' ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  }
};

module.exports = config;
