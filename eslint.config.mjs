import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const config = [
  {
    ignores: ['out/**', '.next/**', '.claude/**', 'next-env.d.ts', 'public/**'],
  },
  ...nextVitals,
  ...nextTs,
  // eslint-config-next already registers the jsx-a11y plugin; turn on its full recommended set.
  { files: ['**/*.{jsx,tsx}'], rules: jsxA11y.flatConfigs.recommended.rules },
  // Node scripts are CommonJS.
  { files: ['**/*.{js,cjs}'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
];

export default config;
