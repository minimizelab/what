import Link from 'next/link';
import { FC } from 'react';

const Nav: FC = () => (
  <nav className="flex flex-col lg:flex-row space-x-6 h-full items-end justify-end">
    <p className="md:text-3xl text-2xl hover:text-what-red-01">
      <Link href="/" className="cursor-pointer">
        Projekt
      </Link>
    </p>
    <p className="md:text-3xl text-2xl hover:text-what-red-01">
      <Link href="/studio" className="cursor-pointer">
        Studio
      </Link>
    </p>
  </nav>
);

export default Nav;
