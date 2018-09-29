module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: false,
    node: true,
  },
  extends: ['airbnb-base'],
  rules: {
    'no-underscore-dangle': [2, { allowAfterThis: true }],
  },
};
