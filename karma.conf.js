//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './',
	frameworks: ['jasmine'],
    files: [ 
	  'js/*.js',
      'unit_tests/*.js',
	  'https://www.gstatic.com/firebasejs/ui/live/0.5/firebase-ui-auth.js'
    ],
	exclude: [
	],
	preprocessors: {
	},
	reporters: ['progress', 'coverage'],
	coverageReporter: {
			type: 'html',
			dir: 'coverage/',
			subdir: '.'
	},
	port: 8080,
	colors: true,
    browsers: ['Chrome'],
	singleRun: false,
    plugins: [
      'karma-chrome-launcher',      
      'karma-jasmine',
	  'karma-coverage'
    ]    

  });
};
