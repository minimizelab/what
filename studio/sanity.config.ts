import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import schema from './schemas/schema';
import deskStructure from './deskStructure';

const projectId = 'lu0lnnx1';
const dataset = process.env.SANITY_STUDIO_DATASET || 'development';

const singletons = ['settings', 'studio'];

export default defineConfig({
  title: 'what',
  projectId,
  dataset,
  plugins: [structureTool({ structure: deskStructure }), visionTool(), media()],
  schema: {
    types: schema,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          (templateItem) => !singletons.includes(templateItem.templateId)
        );
      }
      return prev;
    },
    actions: (prev, { schemaType }) => {
      if (singletons.includes(schemaType)) {
        return prev.filter(
          ({ action }) =>
            !['unpublish', 'delete', 'duplicate'].includes(action ?? '')
        );
      }
      return prev;
    },
  },
});
