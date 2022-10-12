import { SanityImageAssetDocument } from '@sanity/client';
import { UseNextSanityImageOptions } from 'next-sanity-image';
import Image, { ImageProps } from 'next/image';
import { FC } from 'react';
import { useSanityImage } from '../../hooks/useSanityImage';

type Props = {
  img: SanityImageAssetDocument;
  options?: UseNextSanityImageOptions;
} & Omit<ImageProps, 'src'>;

export const SanityImage: FC<Props> = ({ img, options, ...rest }) => {
  const sanityImage = useSanityImage(img, {
    blurUpImageWidth: 124,
    blurUpImageQuality: 40,
    blurUpAmount: 24,
    ...options,
  });
  return <Image alt="" {...sanityImage} {...rest} />;
};
