const path = require('path');

module.exports = {
    context: path.join(__dirname, "."),
    entry: "./src/js/index.js",
   mode: "production",
    // mode: "development",
    output: {
      path: path.resolve(__dirname, "docs/js"),
      filename: "main.js"
    },
    // devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: [
           {
              loader: "babel-loader",
              options: {
                presets: ["babel-preset-env"]
              }
           },
           {
              loader: "eslint-loader",
              options: {
                fix: true
              }
           }, 
           
        ]
        }
      ]
    }
  };