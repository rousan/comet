const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/server/index.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            extends: path.join(process.cwd(), './.babelrc'),
          },
        },
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          mangle: false,
          keep_classnames: true,
          keep_fnames: true,
        },
        sourceMap: false,
      }),
    ],
  },
};
