import {
  useNextSanityImage,
  UseNextSanityImageOptions,
  UseNextSanityImageProps,
} from 'next-sanity-image';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from '../lib/sanityClient';

export const useSanityImage = (
  image: SanityImageSource,
  options?: UseNextSanityImageOptions
): UseNextSanityImageProps => {
  const imageProps = useNextSanityImage(client, image, options);
  return imageProps;
};
