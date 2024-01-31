import { getClient } from './sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const client = getClient();

const builder = imageUrlBuilder(client);

export const imageBuilder = (img: SanityImageSource) => builder.image(img);
