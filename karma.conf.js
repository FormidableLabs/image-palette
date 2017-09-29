module.exports = config => {
  config.set({
    // client: {
    //   mocha: {
    //     timeout: 6000
    //   }
    // },
    frameworks: ['mocha', 'chai'],
    files: ['__tests__/**/*.js'],
    preprocessors: {
      '__tests__/**/*.js': ['webpack']
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.png$/,
            loader: 'url-loader'
          }
        ]
      }
    },
    webpackMiddleware: {
      quiet: true
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    concurrency: Infinity
  });
};
