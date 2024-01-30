import { defineField } from 'sanity';
import HighlightIcon from '../../components/HighlightIcon';
import HighlightRender from '../../components/HighlightRender';

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
        annotations: [],
      },
    },
  ],
});

export default RichText;
