const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = (env) => {
    return {
        entry: "./src/index.js",
        output: {
            path: path.join(__dirname, "/dist"),
            filename: "index.js",
            publicPath: "/"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    },
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.(pdf|jpg|png|gif|svg|ico)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name]-[hash:8].[ext]'
                            },
                        }
                    ]
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html"
            }),
            new webpack.EnvironmentPlugin({
                API_URL: '',
                CLIENT_ID: ''
            })
        ]
    }
};

