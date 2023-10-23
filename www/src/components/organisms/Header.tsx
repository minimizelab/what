import { SanityImageAssetDocument } from '@sanity/client';
import classNames from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';
import Nav from './Nav';
import { SanityImage } from '../atoms/SanityImage';

type Props = {
  className?: string;
  filterBar?: React.ReactNode;
  logotype: SanityImageAssetDocument;
};

const Header: FC<Props> = ({ className, filterBar, logotype }) => (
  <header
    className={classNames('pb-8 flex flex-col justify-between', className)}
  >
    <div className="flex flex-row justify-between items-start w-100 mt-8 mb-6">
      <div className="w-40 flex flex-col justify-items-end sm:mr-4 mr-0 pb-1.5">
        <Link href="/" className="cursor-pointer relative block pt-67">
          <SanityImage
            fill
            blur={false}
            width="300"
            height="150"
            objectFit="contain"
            objectPosition="bottom"
            priority
            quality={100}
            img={logotype}
            className="object-contain object-bottom"
            alt="Logotype"
          />
        </Link>
      </div>
      <Nav />
    </div>
    {filterBar}
  </header>
);

export default Header;
