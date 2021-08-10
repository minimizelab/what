import { FC } from 'react';

const Layout: FC = ({ children }) => {
  return (
    <div className="w-screen min-h-screen flex flex-row justify-center">
      <div className="max-w-screen-xl w-full flex flex-col border border-white">
        <nav>WHAT</nav>
        <main className="flex flex-1">{children}</main>
        <footer>Footer</footer>
      </div>
    </div>
  );
};

export default Layout;
