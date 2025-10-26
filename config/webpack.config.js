const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, '../src/main.js')
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name]/index.js",
    },
    module: {
        rules: [
            {
                oneOf: [  // 表示当匹配到一个规则的时候，就不再匹配其他的了
                    {
                        test: /\.js$/,
                        include: [
                            path.resolve(__dirname, '../src')
                        ],
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, // 开缓存
                            cacheCompression: false, // 关闭缓存压缩
                        },
                    }, {
                        test: /\.(scss|css)$/,
                        use: ['css-loader', 'sass-loader']
                    }, {
                        test: /src.+\.html$/, // 只有src中的html文件需要解析
                        use: ['./plugins/html-template-loader.js']
                    }, {
                        test: /\.c$/,
                        use: ['./plugins/shader-loader.js']
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)$/i,
                        type: 'asset',
                        generator: {
                            filename: 'images/[hash][ext][query]',
                        },
                        parser: {
                            dataUrlCondition: {
                                // 当文件小于此大小时，会被转换为 base64 编码的 data URLs
                                maxSize: 8 * 1024 // 8 KB
                            }
                        }
                    },
                ],
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, '../public/index.html'),
            chunks: ["main"],
        })
    ]
};