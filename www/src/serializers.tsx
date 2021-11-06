import Image from 'next/image';
import { urlFor } from './lib/sanity.client';

export default {
  types: {
    image: (props: any) => {
      const src = urlFor(props.node.asset).url();
      return (
        src && (
          <Image
            src={src}
            alt=""
            layout="responsive"
            width="300"
            height="200"
            objectFit="contain"
          />
        )
      );
    },
  },
};
