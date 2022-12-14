const path = require('path');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
      main: './index.js',
      second: './second.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        hot: true,
        compress: true,
        port: 9000,
        static: {
            directory: path.resolve(__dirname, 'dist'),
            watch: true,
        },
    },
    devtool: 'eval-source-map'
};
