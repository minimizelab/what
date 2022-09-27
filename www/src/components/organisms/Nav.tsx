import Link from 'next/link';
import { FC } from 'react';
import TextLarge from '../atoms/TextLarge';

const Nav: FC = () => (
  <nav className="flex flex-col lg:flex-row space-x-6 h-full items-end justify-end">
    <TextLarge className="!text-4xl hover:text-what-brick">
      <Link href="/">projekt</Link>
    </TextLarge>
    <TextLarge className="!text-4xl hover:text-what-brick">
      <Link href="/studio">studio </Link>
    </TextLarge>
  </nav>
);

export default Nav;
