import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const HighlightRender = ({ children }: Props) => (
  <span style={{ fontWeight: 'bold', color: '#e73c29' }}>{children}</span>
);

export default HighlightRender;
