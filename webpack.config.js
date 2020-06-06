const path = require('path')

const defaultMode = 'development'

module.exports = {
  mode: defaultMode,
  target: 'web',
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
