import React, { FunctionComponent } from 'react';

interface Props {
  className?: string;
  white?: boolean;
}

const TextLarge: FunctionComponent<Props> = ({ className, children }) => (
  <p className="text-lg">{children}</p>
);

export default TextLarge;
