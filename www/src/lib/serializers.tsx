import { PortableTextReactComponents } from '@portabletext/react';

const serializers: Partial<PortableTextReactComponents> = {
  marks: {
    highlight: ({ children }) => (
      <span className="text-what-brick">{children}</span>
    ),
  },
};

export default serializers;
