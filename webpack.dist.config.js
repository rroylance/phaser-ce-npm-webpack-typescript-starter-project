var webpack = require('webpack');
var path = require('path');
var GitRevisionPlugin = require('git-revision-webpack-plugin');

module.exports = {
    entry: './src/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'game.min.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.DefinePlugin({
            'DEBUG': false,
            'GIT_REVISION': JSON.stringify(new GitRevisionPlugin().commithash())
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            screw_ie8: true
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
