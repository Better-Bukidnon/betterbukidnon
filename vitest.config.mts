import path from 'node:path';
import { compile } from '@mdx-js/mdx';
import react from '@vitejs/plugin-react';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig, type Plugin } from 'vitest/config';

/** Same MDX options as next.config.ts, so tests render the office files exactly as the build does. */
const mdx: Plugin = {
  name: 'mdx',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.endsWith('.mdx')) return;
    const file = await compile(code, {
      remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
      providerImportSource: '@/mdx-components',
    });
    return String(file.value);
  },
};

export default defineConfig({
  plugins: [mdx, react()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.{js,mjs}'],
  },
});
