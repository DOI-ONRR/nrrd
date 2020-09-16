module.exports = {
  transform: {
    '^.+\\.js?$': '<rootDir>/jest-preprocess.js',
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|yml)$': '<rootDir>/__mocks__/file-mock.js',
  },
  modulePathIgnorePatterns: ['node_modules', '.cache'],
  transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
  globals: {
    __PATH_PREFIX__: '',
  },
  collectCoverage: false,
  testURL: 'http://localhost',
  setupFiles: ['<rootDir>/loadershim.js'],
  reporters: ['default',
    ['jest-junit', {
      suiteName: 'jest tests',
      outputDirectory: './test-results'
    }]
  ]
}
