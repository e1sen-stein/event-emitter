const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (_, argv) => ({
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `event-emitter${argv.mode === 'production' ? '.min' : ''}.js`,
    library: 'EventEmitter',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      }
    ],
  },
  devtool: argv.mode === 'production' ? 'source-map' : 'none',
  optimization: {
    minimize: argv.mode === 'production',
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
      })
    ],
  },
});
