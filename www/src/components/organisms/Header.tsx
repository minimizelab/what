import { SanityImageAssetDocument } from '@sanity/client';
import classNames from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react';
import Image from 'next/image';
import Nav from './Nav';

type Props = {
  className?: string;
  filterBar?: React.ReactNode;
  logotype: SanityImageAssetDocument;
};

const Header: FC<Props> = ({ className, filterBar, logotype }) => (
  <header
    className={classNames('h-64 flex flex-col justify-between', className)}
  >
    <div className="flex flex-row justify-between items-start w-100 mt-8">
      <div className="w-40 flex flex-col justify-items-end">
        <Link href="/">
          <Image
            layout="responsive"
            width="300"
            height="200"
            objectFit="cover"
            objectPosition="center"
            src={logotype.url}
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
