module.exports = {
  root: true,
  extends: ['@vben/stylelint-config'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['use'],
      },
    ],
  },
};
