import { defineField } from 'sanity';
import HighlightIcon from '../components/HighlightIcon';
import HighlightRender from '../components/HighlightRender';

const RichText = defineField({
  name: 'richText',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [],
      lists: [],
      marks: {
        decorators: [
          {
            title: 'Highlight',
            value: 'highlight',
            icon: HighlightIcon,
            component: HighlightRender,
          },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Länk',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (R) =>
                  R.required().uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                    allowRelative: true,
                  }),
              },
            ],
          },
        ],
      },
    },
  ],
});

export default RichText;
