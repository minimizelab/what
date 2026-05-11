import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'what',

  projectId: 'lu0lnnx1',
  dataset: 'development',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
