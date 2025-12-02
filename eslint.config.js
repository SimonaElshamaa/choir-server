import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({});

export default [
  ...compat.extends('eslint:recommended', 'plugin:react/recommended'),
  ...compat.plugins('react'),
  {
    rules: {
      // your rules
    },
  },
];
