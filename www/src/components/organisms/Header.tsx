import { FC } from 'react';

type Props = { title: string; className?: string };

const Header: FC<Props> = ({ title, children, className }) => (
  <header className={className}>
    <h1>{title}</h1>
    {children}
  </header>
);

export default Header;
