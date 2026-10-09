import { defineConfig, defineSingleton } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import schema from './schemas/schema';
import deskStructure from './deskStructure';

const projectId = 'lu0lnnx1';
const dataset = process.env.SANITY_STUDIO_DATASET || 'development';

const singletons = [
  defineSingleton({ documentId: 'settings', schemaType: 'settings' }),
  defineSingleton({ documentId: 'studio', schemaType: 'studio' }),
];
const singletonTypes: string[] = singletons.map((singleton) => singleton.schemaType);

export default defineConfig({
  title: 'what',
  projectId,
  dataset,
  plugins: [structureTool({ structure: deskStructure }), visionTool(), media()],
  schema: {
    types: schema,
  },
  document: {
    // Hides them from create menus and default lists, and blocks duplicating.
    singletons,
    // The built-in singleton handling still allows these.
    actions: (prev, { schemaType }) => {
      if (singletonTypes.includes(schemaType)) {
        return prev.filter(
          ({ action }) => !['unpublish', 'delete'].includes(action ?? '')
        );
      }
      return prev;
    },
  },
});
