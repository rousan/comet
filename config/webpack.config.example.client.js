const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../example/client.js'),
  output: {
    path: path.resolve(__dirname, '../example/dist'),
    filename: 'client.js',
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
  devServer: {
    inline: true,
    contentBase: './example',
  },
};
