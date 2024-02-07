import { FC, ReactNode } from 'react';

const H2: FC<{ children?: ReactNode }> = ({ children }) => {
  return <h2 className="text-xl">{children}</h2>;
};

export default H2;
