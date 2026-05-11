import type { ClientConfig } from '@sanity/client';

const config: ClientConfig = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-07',
  useCdn: false,
};

export default config;
