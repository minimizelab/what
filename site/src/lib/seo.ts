import type { SanityImageSource } from '@sanity/image-url';
import { imageBuilder } from './imageBuilder';

type Block = {
  _type: string;
  children?: { text?: string }[];
};

/** The opening text of Portable Text content, cut at a word boundary. */
export const excerpt = (
  blocks: Block[] | null | undefined,
  maxLength = 160
): string | undefined => {
  const text = (blocks ?? [])
    .filter((block) => block._type === 'block')
    .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return undefined;
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '')}…`;
};

/** A 1200×630 JPEG for link previews (`og:image`). */
export const shareImage = (asset: SanityImageSource | null | undefined) =>
  asset ? imageBuilder(asset).width(1200).height(630).format('jpg').url() : undefined;
