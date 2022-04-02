const glob = require("glob");
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let allEntry = {};
let htmlWebpackPluginList = [];
const entryFiles = glob.sync(resolve(__dirname, "./src/pages/*/index.js"));
entryFiles.map(item => { 
  const match = item.match(/src\/pages\/(.*)\/index\.js$/);
  const pageName = match?.[1];
  console.log(pageName);
  allEntry[pageName] = item;
  htmlWebpackPluginList.push(
    new HtmlWebpackPlugin({
      title: pageName,
      filename: `pages/${pageName}.html`,
      template: resolve(__dirname, `./src/pages/${pageName}/index.html`),
      inject: "body",
      chunks: [pageName]
    })
  );
});
console.log(allEntry, htmlWebpackPluginList);

module.exports = {
  mode: "development",
  devtool:"cheap-module-source-map",
  entry: allEntry,
  output: {
    path: resolve(__dirname, "dist"),
    filename: "scripts/[name]_[chunkhash].js",
    clean: true,
  },
  resolve: { 
    alias: {
      "@": resolve(__dirname, "src"),
    },
    extensions:[".js", ".less", ".html"]
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: "css-loader",
          options: {
            importLoaders: 2,
          }
        }, "postcss-loader", "less-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@bable/preset-env",
              {
                targets: [
                  "last 1 versions",
                  ">1%"
                ],
                useBuiltIns: "usage"
              }
            ]
          }
        }

      }
    ]
  },
  plugins: [
    ...htmlWebpackPluginList,
    new MiniCssExtractPlugin({
      filename:"styles/[name]_[contenthash].css"
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  devServer: {
    static: "./dist",
    port: "8081",
    host: "0.0.0.0"
  }
}