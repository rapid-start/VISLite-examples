const config = require('./webpack.config');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPublicPlugin = require('../plugins/copy-public-plugin');

config.mode = "production";
config.output = {
    path: path.resolve(__dirname, "../docs"),
    filename: "[name].js",
    chunkFilename: "bundle/[name].js",
    assetModuleFilename: "images/[name][ext]",
    clean: true
};
config.optimization = {
    minimizer: [new TerserPlugin({
        extractComments: false
    })]
};
config.plugins.push(new CopyPublicPlugin({
    source: "public",
    target: "docs",
    ignore: ["index.html"]
}));

module.exports = config;