import React, { FC } from 'react';

const HighlightRender: FC = ({ children }) => (
  <span style={{ fontWeight: 'bold', color: '#e73c29' }}>{children}</span>
);

export default HighlightRender;
