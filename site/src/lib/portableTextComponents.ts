import type { SomePortableTextComponents } from 'astro-portabletext/types';
import Highlight from '../components/portable-text/Highlight.astro';
import Link from '../components/portable-text/Link.astro';
import BlockProject from '../components/portable-text/BlockProject.astro';
import BlockStudio from '../components/portable-text/BlockStudio.astro';

export const projectTextComponents: SomePortableTextComponents = {
  mark: {
    highlight: Highlight,
    link: Link,
  },
  type: {},
  block: {
    normal: BlockProject,
  },
};

export const studioTextComponents: SomePortableTextComponents = {
  mark: {
    highlight: Highlight,
    link: Link,
  },
  type: {},
  block: {
    normal: BlockStudio,
  },
};
