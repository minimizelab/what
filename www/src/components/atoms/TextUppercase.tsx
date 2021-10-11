import React, { FunctionComponent } from 'react';

const TextUppercase: React.FC = ({ children }) => (
  <p className={'uppercase tracking-wider text-xs'}>{children}</p>
);

export default TextUppercase;
