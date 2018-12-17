/**
 * creat by chenghao 2018/12/14
 */
var path = require('path');
var fs = require("fs");
const merge = require('webpack-merge')
var webpack = require('webpack');
module.exports = {
    watch:true,
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/
    },
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "index.js"
    },
    plugins: []
}
