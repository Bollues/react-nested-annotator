const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
module.exports = {
    entry: {
        app: './src/index.tsx',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:"./src/index.html",
            filename:"./index.html"
        }),
        new CheckerPlugin()
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { test:/\.html$/, use:[ { loader:"html-loader" } ] },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
        ]
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename:'[name].chunk.js',
        path: path.resolve('./dist'),
        publicPath: "/",
    },
}
