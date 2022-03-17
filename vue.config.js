const path = require('path');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isServer = process.env.VUE_APP_ENV === "server";

const {devPort} = require("./config/index");

module.exports = {
    outputDir: './dist',
    configureWebpack: {
        target: isServer ? "node" : "web",
        node: isServer? undefined : false,
        devtool: isServer ? 'none' : isDev ?  'hidden-source-map' : 'source-map',
        entry: {
            app: `./src/${process.env.VUE_APP_ENV}-entry.js`,
        },
        output: {
            libraryTarget: isServer ? "commonjs2" : undefined,
        },
        devtool: '#cheap-module-source-map',
        resolve: {
            extensions: ['.js', '.vue']
        },
        plugins: [
            // 这是将服务器的整个输出
            // 构建为单个 JSON 文件的插件。
            // 默认文件名为 `vue-ssr-server-bundle.json`
            isServer ? new VueSSRServerPlugin() : new VueSSRClientPlugin()
        ],
        optimization: {
            splitChunks: isServer ?  false : undefined,
        }
    },
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        port: devPort,
        hot: true,
        progress: false
    }
}