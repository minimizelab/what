import { SanityImageAssetDocument } from '@sanity/client';
import { FC } from 'react';
import classNames from 'classnames';
import { SanityImage } from '../atoms/SanityImage';

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
          <SanityImage
            img={img}
            sizes="(min-width: 1792px) 1792p, 100vw"
            layout="responsive"
            objectFit="contain"
          />
        </div>
      ))}
    </div>
  );
};

const isLandscape = (img: SanityImageAssetDocument) =>
  img.metadata.dimensions.height < img.metadata.dimensions.width;
