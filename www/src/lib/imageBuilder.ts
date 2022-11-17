import { getClient } from './sanity.server';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const client = getClient(false);

const builder = imageUrlBuilder(client);

export const imageBuilder = (img: SanityImageSource) => builder.image(img);
