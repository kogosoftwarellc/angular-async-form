module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['chai', 'jasmine', 'sinon', 'sinon-chai'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'lib/*.js'
    ],
    plugins: [
      'karma-chai',
      'karma-coverage',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-sinon',
      'karma-sinon-chai'
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
