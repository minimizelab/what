import HighlightIcon from '../../components/HighlightIcon';
import HighlightRender from '../../components/HighlightRender';

const RichText = {
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
};

export default RichText;
