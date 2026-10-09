import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'lu0lnnx1',
    dataset: 'development'
  },
  deployment: {
    // Hosted at https://whats.sanity.studio
    appId: 'ooh0kmphvyge4qm9p42wj1pa',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
  schemaExtraction: {
    path: 'schema.json',
    enforceRequiredFields: true,
  },
  // Types for the site's GROQ queries, generated from this schema.
  typegen: {
    path: '../site/src/**/*.ts',
    schema: 'schema.json',
    generates: '../site/src/sanity.types.ts',
    overloadClientMethods: true,
  },
})
