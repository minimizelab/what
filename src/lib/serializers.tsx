import { PortableTextReactComponents } from '@portabletext/react';

const serializers: Partial<PortableTextReactComponents> = {
  marks: {
    highlight: ({ children }) => (
      <span className="text-what-red-01">{children}</span>
    ),
    link: ({ value, children }) => {
      const href: string = value?.href ?? '';
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="underline hover:text-what-red-01 focus:text-what-red-01 cursor-pointer"
          {...(isExternal && {
            target: '_blank',
            rel: 'noopener noreferrer',
          })}
        >
          {children}
        </a>
      );
    },
  },
};

export default serializers;
