import { SanityImageAssetDocument } from '@sanity/client';
import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

export const ImageGrid: FC<{ images: SanityImageAssetDocument[] }> = ({
  images,
}) => {
  let centeredImg: string | undefined;
  const portraitImages = images.filter((img) => !isLandscape(img));
  if (portraitImages.length % 2) {
    centeredImg = portraitImages.pop()?._id;
  }
  return (
    <div className="grid grid-cols-4 grid-flow-row-dense gap-10 items-center justify-center">
      {images.map((img) => (
        <div
          key={img._id}
          className={classNames(
            'col-span-4',
            !isLandscape(img) && 'md:col-span-2',
            img._id === centeredImg && 'md:col-start-2'
          )}
        >
          <Image
            src={img.url}
            alt=""
            sizes="(max-width: 1440px) 100vw, 1440px"
            placeholder={img.metadata.lqip ? 'blur' : 'empty'}
            layout="responsive"
            width={img.metadata.dimensions.width}
            height={img.metadata.dimensions.height}
            objectFit="contain"
            blurDataURL={img.metadata.lqip}
          />
        </div>
      ))}
    </div>
  );
};

const isLandscape = (img: SanityImageAssetDocument) =>
  img.metadata.dimensions.height < img.metadata.dimensions.width;
