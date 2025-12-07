const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config');

config.mode = "development";
config.devServer = {
    open: false,
    host: '0.0.0.0',
    port: 20000,
    hot: true,
    compress: false,
    static: "./docs"
};
config.plugins = [
    new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, '../docs/index.html'),
        chunks: [],
    })
]

module.exports = config;