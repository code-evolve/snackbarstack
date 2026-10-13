const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production'

// Vue is supplied by the host application, never bundled.
const externals = {
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue'
  }
}

const base = {
  mode,
  // Both bundles run in the browser
  target: 'web',
  entry: './src/SnackbarStackPlugin.js',
  externals,
  resolve: {
    extensions: [ '.js', '.json', '.vue' ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          // Not vue-style-loader: under a 'node' target it registers styles for
          // server rendering and the component CSS never reaches the page
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  // vue-loader 15 imports a default export from every style block for CSS
  // modules support; the component uses none, so webpack 5's warning is noise.
  ignoreWarnings: [ /export 'default' \(imported as 'style\d+'\) was not found/ ],
  stats: 'minimal',
  devtool: mode === 'development' ? 'source-map' : false,
  plugins: [
    new VueLoaderPlugin()
  ]
}

// Package entry point for bundlers: exports { default: SnackbarStackPlugin }.
const module_ = {
  ...base,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.node.js',
    library: { type: 'umd' },
    globalObject: 'this'
  }
}

// Script-tag build: exposes window.SnackbarStackPlugin.
const browser = {
  ...base,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'SnackbarStackPlugin',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  }
}

module.exports = [ module_, browser ]
