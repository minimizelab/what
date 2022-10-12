import { SanityImageAssetDocument } from '@sanity/client';
import { FC } from 'react';
import { SanityImage } from '../atoms/SanityImage';

type Props = {
  img?: SanityImageAssetDocument;
};

const ProjectCard: FC<Props> = ({ img }) => {
  return (
    <div className="flex flex-col">
      <div className="relative flex-1">
        {img && (
          <SanityImage
            img={img}
            sizes="(max-width: 1000px) 50vw, 1440px"
            layout="responsive"
            width="300"
            height="200"
            objectFit="cover"
            objectPosition="center"
            alt="Main image"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
