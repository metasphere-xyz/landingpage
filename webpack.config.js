const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const defaultMode = 'development'

module.exports = {
  mode: defaultMode,
  target: 'web',
  entry: {
    'main': './src/js/main.js',
    'research-explorer': './src/js/research-explorer.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './js')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    alias: {
      // uses Vue with a compiler
      'vue$': 'vue/dist/vue.esm.js',
      '@components': path.resolve(__dirname, './src/js/components')
    },
    extensions: [
      '.js',
      '.vue'
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
