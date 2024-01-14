import { PortableTextReactComponents } from '@portabletext/react';

const serializers: Partial<PortableTextReactComponents> = {
  marks: {
    highlight: ({ children }) => (
      <span className="text-what-red-01">{children}</span>
    ),
  },
};

export default serializers;
