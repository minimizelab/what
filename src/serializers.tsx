import { SanityImageAssetDocument } from '@sanity/client';
import { SanityImage } from './components/atoms/SanityImage';

type ImageNode = {
  asset: SanityImageAssetDocument;
};

const image = ({ node: { asset } }: { node: ImageNode }) => (
  <div className="mb-2 mt-4 flex items-center justify-center">
    <SanityImage
      alt=""
      img={asset}
      width={asset.metadata.dimensions.width}
      height={asset.metadata.dimensions.height}
      sizes="(min-width: 1792px) 1792p, 100vw"
    />
  </div>
);

export const projectSerializers = {
  types: {
    image,
  },
};
