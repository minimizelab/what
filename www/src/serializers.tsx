import { SanityImageAssetDocument } from '@sanity/client';
import Image from 'next/image';

type ImageNode = {
  asset: SanityImageAssetDocument;
};

const image = ({
  node: {
    asset: { url, metadata },
  },
}: {
  node: ImageNode;
}) => (
  <div className="mb-2 mt-4">
    <Image
      src={url}
      alt=""
      placeholder={metadata.lqip ? 'blur' : 'empty'}
      layout="responsive"
      width={metadata.dimensions.width}
      height={metadata.dimensions.height}
      objectFit="contain"
      blurDataURL={metadata.lqip}
    />
  </div>
);

export const projectSerializers = {
  types: {
    image,
  },
};
