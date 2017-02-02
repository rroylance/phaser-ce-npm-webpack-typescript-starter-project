var webpack = require('webpack');
var path = require('path');
var GitRevisionPlugin = require('git-revision-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'game.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.DefinePlugin({
            'DEBUG': true,
            'GIT_REVISION': JSON.stringify(new GitRevisionPlugin().commithash())
        }),
        new CleanWebpackPlugin([
            'dist'
        ]),
        new HtmlWebpackPlugin({
            title: 'Phaser NPM Webpack TypeScript Starter Project!'
        }),
        new CopyWebpackPlugin([{
            from: './assets',
            to: './assets'
        }])
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
        inline: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
            ignored: /node_modules/
        }
    },
    module: {
        noParse: [
            /phaser-ce/
        ],
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};
