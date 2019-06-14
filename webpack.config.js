const fs = require('fs');
const path = require('path');
const { flattenDeep, zipObject } = require('lodash');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function getFiles(dir) {
  const realDir = dir.endsWith('/') ? dir.slice(0, -1) : dir;
  const all = fs.readdirSync(realDir);
  return all.map(file => {
    if (fs.statSync(`${realDir}/${file}`).isDirectory()) {
      return getFiles(`${realDir}/${file}`);
    }
    return `${realDir}/${file}`;
  });
}

const filesPath = flattenDeep(getFiles('./src'));
const entryKeys = filesPath.map(str => str.match(/\.\/src\/(.*)?\.js/)[1]);
const entry = zipObject(entryKeys, filesPath);

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'libs'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'TypingsDemo',
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
