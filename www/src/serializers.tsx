import { SanityImageAssetDocument } from '@sanity/client';
import Image from 'next/image';

export default {
  types: {
    image: ({
      node: { asset },
    }: {
      node: { asset: SanityImageAssetDocument };
    }) => (
      <Image
        src={asset.url}
        alt=""
        placeholder={asset.metadata.lqip ? 'blur' : 'empty'}
        layout="responsive"
        width={asset.metadata.dimensions.width}
        height={asset.metadata.dimensions.height}
        objectFit="contain"
        blurDataURL={asset.metadata.lqip}
      />
    ),
  },
};
