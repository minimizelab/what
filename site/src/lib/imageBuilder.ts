import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { client } from './sanityClient';

const builder = createImageUrlBuilder(client);

export const imageBuilder = (img: SanityImageSource) => builder.image(img);
