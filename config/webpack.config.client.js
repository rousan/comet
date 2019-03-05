const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/client/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: 'index.js',
    library: 'CometClient',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'source-map',
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
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          mangle: false,
          keep_classnames: true,
          keep_fnames: true,
        },
        sourceMap: true,
      }),
    ],
  },
};
