module.exports = {
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  reporters: [
      "default",
      ["jest-html-reporter", {
          "pageTitle": "Test Report",
          "outputPath": "test-report.html",
          "includeFailureMsg": true,
          "includeConsoleLog": true
      }]
  ]
};
