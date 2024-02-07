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
            'col-span-4 h-full flex justify-center items-center',
            !isLandscape(img) && 'md:col-span-2',
            img._id === centeredImg && 'md:col-start-2'
          )}
        >
          <SanityImage
            alt=""
            img={img}
            width={img.metadata.dimensions.width}
            height={img.metadata.dimensions.height}
            sizes="(min-width: 1792px) 1792p, 100vw"
          />
        </div>
      ))}
    </div>
  );
};

const isLandscape = (img: SanityImageAssetDocument) =>
  img.metadata.dimensions.height < img.metadata.dimensions.width;
