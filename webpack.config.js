const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackPwaManifest = require("webpack-pwa-manifest");

module.exports = {
    entry: {
        app: "./assets/js/script.js"
    },
    output: {
        filename: '[name].bundle.js',
        path: `${__dirname}/dist`
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name(file) {
                                return '[path][name].[ext]'
                            },
                            publicPath: (url) => {
                                return url.replace('../', '/assets/')
                            }
                        }
                    }
                ]
            },
            {
                loader: 'image-webpack-loader'
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
        new WebpackPwaManifest({
            name: 'Budget Tracker',
            short_name: 'Budgeter',
            description: 'A budget tracker app to allow you to manage your finances on the go.',
            background_color: '#dddddd',
            theme_color: '#dddddd',
            fingerprints: false,
            inject: false,
            icons: [{
                src: path.resolve("assets/icons/icon-512x512.png"),
                sizes: [95, 128, 192, 256, 384, 512],
                destination: path.join("assets", "icons")
            }]
        })
    ],
    mode: 'development'
};