module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'prefer-const': 'warn'
  },
  env: {
    browser: true,
    es6: true,
    node: true
  }
};
