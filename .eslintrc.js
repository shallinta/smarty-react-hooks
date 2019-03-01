module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-airbnb'
  ].map(require.resolve),
  plugins: [
    'react-hooks' // eslint-plugin-react-hooks 对react hooks语法的规范提示
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'eol-last': 'off',
    'comma-dangle': 'off',
    'import/no-unresolved': ['error', { ignore: ['react'] }]
  }
};
