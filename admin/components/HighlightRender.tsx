import React, { FC, ReactNode } from 'react';

const HighlightRender: FC<{ children?: ReactNode }> = ({ children }) => (
  <span style={{ fontWeight: 'bold', color: '#e73c29' }}>{children}</span>
);

export default HighlightRender;
