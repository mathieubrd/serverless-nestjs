const nodeExternals = require("webpack-node-externals")
const path = require("path")
const slsw = require("serverless-webpack")

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  devtool: slsw.lib.webpack.isLocal ? "source-map" : "cheap-source-map",
  entry: slsw.lib.entries,
  target: "node",
  resolve: {
    extensions: [".cjs", ".mjs", ".js", ".ts"],
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  externals: ["aws-sdk", nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, ".serverless"),
            path.resolve(__dirname, "dist"),
          ],
        ],
      },
    ],
  },
}
