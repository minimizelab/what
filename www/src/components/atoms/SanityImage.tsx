import { SanityImageAssetDocument } from '@sanity/client';
import { UseNextSanityImageOptions } from 'next-sanity-image';
import Image, { ImageProps } from 'next/legacy/image';
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
  ...rest
}) => {
  const sanityImage = useSanityImage(img, options);
  if (blur) {
    return (
      <Image
        alt=""
        {...sanityImage}
        {...rest}
        placeholder="blur"
        blurDataURL={img.metadata.lqip}
      />
    );
  }
  return <Image placeholder="empty" alt="" {...sanityImage} {...rest} />;
};
