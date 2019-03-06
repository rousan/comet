const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../example/server.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../example/dist'),
    filename: 'server.js',
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
};
