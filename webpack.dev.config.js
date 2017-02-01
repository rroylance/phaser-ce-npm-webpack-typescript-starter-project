var webpack = require('webpack');
var path = require('path');
var GitRevisionPlugin = require('git-revision-webpack-plugin');

module.exports = {
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'game.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.DefinePlugin({
            'DEBUG': true,
            'GIT_REVISION': JSON.stringify(new GitRevisionPlugin().commithash())
        })
    ],
    module: {
        noParse: [
            /phaser-ce/
        ],
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};
