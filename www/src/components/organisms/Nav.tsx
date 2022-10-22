import Link from 'next/link';
import { FC } from 'react';

const Nav: FC = () => (
  <nav className="flex flex-col lg:flex-row space-x-6 h-full items-end justify-end">
    <p className="sm:text-3xl text-2xl hover:text-what-brick">
      <Link href="/">
        <a className="cursor-pointer">projekt</a>
      </Link>
    </p>
    <p className="sm:text-3xl text-2xl hover:text-what-brick">
      <Link href="/studio">
        <a className="cursor-pointer">studio</a>
      </Link>
    </p>
  </nav>
);

export default Nav;
