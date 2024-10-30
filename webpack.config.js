const path = require('path');

const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const lightningcss = require('lightningcss');
const browserslist = require('browserslist'); 

module.exports = [
    {
       entry: "./src/index.js", // Entry point of your application
        output: {
            filename: "bundle.js", // Output bundle file name
            path: path.resolve(__dirname, "dist"), // Output directory
        },
        mode: 'development',
        module: {
            rules: [
                {
                    test: /.(ts|js)x?$/,
                    use: {
                        loader: 'swc-loader',
                        options: {
                            minify: process.env.NODE_ENV !== 'development',
                            jsc: {
                                target: 'es2021',
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true,
                                },
                                transform: {
                                    react: {
                                        runtime: 'automatic',
                                    },
                                },
                            },
                        },
                    },
                    include: [path.resolve('./src')],
                }
            ],
        },
        resolve: {
            extensions: [".js", ".jsx"],
        },
        optimization: {
            minimize: true,
            minimizer: [
            new CssMinimizerPlugin({
                minify: CssMinimizerPlugin.lightningCssMinify,
                minimizerOptions: {
                targets: lightningcss.browserslistToTargets(browserslist('>= 0.25%'))
                },
            }),
            ],
        },
    },
];