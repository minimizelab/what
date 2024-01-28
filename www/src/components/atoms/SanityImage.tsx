import { SanityImageAssetDocument } from '@sanity/client';
import { UseNextSanityImageOptions } from 'next-sanity-image';
import Image, { ImageProps } from 'next/image';
import { FC } from 'react';
import { useSanityImage } from '../../hooks/useSanityImage';

type Props = {
  img: SanityImageAssetDocument;
  options?: UseNextSanityImageOptions;
  blur?: boolean;
} & Omit<ImageProps, 'src'>;

export const SanityImage: FC<Props> = ({
  img,
  options,
  blur = true,
  alt,
  ...rest
}) => {
  // eslint-disable-next-line no-unused-vars
  const { width, height, ...sanityImage } = useSanityImage(img, options);
  if (blur) {
    return (
      <Image
        alt={alt}
        {...sanityImage}
        {...rest}
        placeholder="blur"
        blurDataURL={img.metadata.lqip}
      />
    );
  }
  return <Image alt={alt} placeholder="empty" {...sanityImage} {...rest} />;
};
