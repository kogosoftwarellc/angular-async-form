module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'lib/*.js'
    ],
    plugins: [
      'karma-coverage',
      'karma-jasmine',
      'karma-phantomjs-launcher'
    ],
    preprocessors: {
      'lib/!(*.spec).js': ['coverage']
    },
    reporters: ['dots', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    }
  });
};
