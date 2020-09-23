module.exports = {
  transform: {
    '^.+\\.js?$': '<rootDir>/jest-preprocess.js',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|yml)$': '<rootDir>/__mocks__/file-mock.js',
    'content-partials/(.*)': '<rootDir>/__mocks__/content-partials-mock.js'
  },
  modulePathIgnorePatterns: ['node_modules', '.cache'],
  transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
  globals: {
    __PATH_PREFIX__: '',
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>/__test_utils__',
  ],
  collectCoverage: true,
  testURL: 'http://localhost',
  setupFiles: ['<rootDir>/loadershim.js'],
  reporters: ['default',
    ['jest-junit', {
      suiteName: 'jest tests',
      outputDirectory: './test-results'
    }]
  ]
}
