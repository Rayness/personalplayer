const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => 
{
    return {
        mode: options.mode,
        entry: [
            "./src/index.tsx",
            // "./src/assets/stylesheets/app.scss",
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, "./dist")
            }
        },
        target: "web",
        resolve: {
            modules: ['node_modules', 'src'],
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: {
                                    localIdentContext: path.resolve(`${__dirname}/../`),
                                    localIdentName: '[path][name]___[local]___[pathHash]',
                                    mode: 'global',
                                },
                            },
                        },
                        'postcss-loader',
                    ],
                },
                {
                    test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
                    type: "javascript/auto",
                    loader: "file-loader",
                    options: {
                        publicPath: "../",
                        name: "[path][name].[ext]",
                        context: path.resolve(__dirname, "src/assets"),
                        emitFile: false,
                    },
                },
                {
                    test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                    type: "javascript/auto",
                    exclude: /images/,
                    loader: "file-loader",
                    options: {
                        publicPath: "../",
                        context: path.resolve(__dirname, "src/assets"),
                        name: "[path][name].[ext]",
                        emitFile: false,
                    },
                },
            ],
        },
        output: {
            filename: "js/[name].bundle.js",
            path: path.resolve(__dirname, "./dist"),
            publicPath: "",
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                inject: true,
                minify: false
            }),
            new MiniCssExtractPlugin({filename: 'styles.[name].css', ignoreOrder: true}),
            // new CopyPlugin({
            //     patterns: [
            //         { from: "./src/assets/images", to: "images" },
            //         { from: "./src/assets/fonts", to: "fonts" },
            //         { from: "./src/assets/vendor", to: "js" },
            //     ]
            // }),
        ]
    };
};