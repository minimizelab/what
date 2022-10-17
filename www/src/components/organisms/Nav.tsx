import Link from 'next/link';
import { FC } from 'react';
import TextLarge from '../atoms/TextLarge';

const Nav: FC = () => (
  <nav className="flex flex-col lg:flex-row space-x-6 h-full items-end justify-end">
    <TextLarge className="sm:text-4xl text-3xl hover:text-what-brick">
      <Link href="/">
        <a className="cursor-pointer">projekt</a>
      </Link>
    </TextLarge>
    <TextLarge className="sm:text-4xl text-3xl hover:text-what-brick">
      <Link href="/studio">
        <a className="cursor-pointer">studio</a>
      </Link>
    </TextLarge>
  </nav>
);

export default Nav;
