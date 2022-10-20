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
    className={classNames('pb-6 flex flex-col justify-between', className)}
  >
    <div className="flex flex-row justify-between items-start w-100 mt-8 mb-6">
      <div className="w-40 flex flex-col justify-items-end sm:mr-4 mr-0">
        <Link href="/">
          <a className="cursor-pointer">
            <SanityImage
              layout="responsive"
              options={{
                enableBlurUp: false,
              }}
              width="300"
              height="200"
              objectFit="contain"
              objectPosition="center"
              priority
              quality={100}
              img={logotype}
              alt="Logotype"
            />
          </a>
        </Link>
      </div>
      <Nav />
    </div>
    {filterBar}
  </header>
);

export default Header;
