const path = require('path');

module.exports = {
    context: path.join(__dirname, "."),
    entry: "./src/js/index.js",
    mode: "development",
    output: {
      path: path.resolve(__dirname, "public/js"),
      filename: "bundle.js"
    },
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
           "eslint-loader"
        ]
        }
      ]
    }
  };