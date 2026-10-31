export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['src/assets/**'],
  rules: {
    'value-keyword-case': [
      'lower',
      { camelCaseSvgKeywords: true, ignoreKeywords: ['Inter', 'Roboto'] },
    ],
  },
}
