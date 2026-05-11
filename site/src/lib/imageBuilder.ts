import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from './sanityClient';

const builder = imageUrlBuilder(client);

export const imageBuilder = (img: SanityImageSource) => builder.image(img);
