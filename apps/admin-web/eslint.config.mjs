import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      'node_modules',
      'dist',
      '.next',
      '.nuxt',
      'coverage',
      'build',
      '.turbo',
      '.next',
      'out',
    ],
  },
];

export default config;
