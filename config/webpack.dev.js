const config = require('./webpack.config');

config.mode = "development";
config.devServer = {
    open: false,
    host: '0.0.0.0',
    port: 20000,
    hot: true,
    compress: false
};

module.exports = config;