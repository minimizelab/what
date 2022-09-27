import HighlightIcon from '../../components/HighlightIcon';
import HighlightRender from '../../components/HighlightRender';
import { ArrayField } from '../../types';

const RichText: ArrayField = {
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
            blockEditor: {
              icon: HighlightIcon,
              render: HighlightRender,
            },
          },
        ],
        annotations: [],
      },
    },
  ],
};

export default RichText;
