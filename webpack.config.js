const path = require('path')
const webpack = require('webpack')
const str = JSON.stringify
const { optimize: { CommonsChunkPlugin }, DefinePlugin } = webpack
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const GitRevisionPlugin = require('git-revision-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin()
const PROJECT_ROOT = path.resolve(__dirname)

module.exports = {
  entry: {
    main: [path.join(PROJECT_ROOT, 'src')],
    vendor: ['babel-polyfill', 'react', 'react-dom', 'mobx', 'mobx-react'],
  },
  output: {
    path: path.join(PROJECT_ROOT, 'build'),
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: ['node_modules', path.join(PROJECT_ROOT, 'src')],
  },
  plugins: [
    gitRevisionPlugin,
    new CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[hash].js',
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      title: 'Learn about Color Spaces',
      filename: 'index.html',
      template: path.join(PROJECT_ROOT, 'src/index.html')
    }),
    new DefinePlugin({
      __VERSION__: str(gitRevisionPlugin.commithash() + '@' + gitRevisionPlugin.version()),
      __DEV__: process.env.NODE_ENV !== 'production'
    }),
  ],
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
