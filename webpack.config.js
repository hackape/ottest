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
    // vendor: ['babel-polyfill', 'react', 'react-dom', 'redux', 'react-redux'],
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
    new DefinePlugin({
      __VERSION__: str(gitRevisionPlugin.commithash() + '@' + gitRevisionPlugin.version()),
    }),
    new CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[chunkhash].js',
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      title: 'Learn about Color Spaces',
      template: path.join(PROJECT_ROOT, 'src/index.html')
    }),
  ],
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
}
