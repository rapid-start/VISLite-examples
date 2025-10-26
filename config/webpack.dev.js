const config = require('./webpack.config');

config.mode = "development";
config.devServer = {
    open: false,
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    compress: false
};

module.exports = config;