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
  // A labelled role="region" scroll container must be focusable so keyboard users can scroll it
  // (axe scrollable-region-focusable).
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { tags: [], roles: ['tabpanel', 'region'], allowExpressionValues: true },
      ],
    },
  },
  // Node scripts are CommonJS.
  { files: ['**/*.{js,cjs}'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
];

export default config;
