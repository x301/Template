const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const pug = require("./webpack/pug");
const devserver = require("./webpack/devserver");
const sass = require("./webpack/sass");
const css = require("./webpack/css");
const extractCSS = require("./webpack/css.extract");
const uglifyJS = require("./webpack/js.uglify");
const images = require("./webpack/images");
const fonts = require("./webpack/fonts");

const PATHS = {
  source: path.join(__dirname, "src"),
  build: path.join(__dirname, "dist")
};

const common = merge([
  {
    entry: {
      index: PATHS.source + "/js/index.js"
    },
    output: {
      path: PATHS.build,
      filename: "js/[name].js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        chunks: ["index", "common"],
        template: PATHS.source + "/index.pug"
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: "common"
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      })
    ]
  },
  pug(),
  fonts(),
  images()
]);

module.exports = function(env) {
  if (env === "production") {
    return merge([common, extractCSS(), uglifyJS()]);
  }
  if (env === "development") {
    return merge([common, devserver(), sass(), css()]);
  }
};
