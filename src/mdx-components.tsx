import type { MDXComponents } from 'mdx/types';
import { officeMdxComponents } from '@/features/service-details/mdxComponents';

/** Required by @next/mdx: the components every compiled .mdx file can use. */
export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...officeMdxComponents, ...components };
}
