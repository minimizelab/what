import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import schema from './schemas/schema';
import deskStructure from './deskStructure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

const singletons = ['settings', 'studio'];

export default defineConfig({
  title: 'what',
  projectId,
  dataset,
  basePath: '/admin',
  plugins: [structureTool({ structure: deskStructure }), visionTool()],
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
          ({ action }) => !['unpublish', 'delete', 'duplicate'].includes(action ?? '')
        );
      }
      return prev;
    },
  },
});
