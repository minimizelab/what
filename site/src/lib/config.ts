import type { ClientConfig } from '@sanity/client';
import {
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_PROJECT_ID,
} from 'astro:env/server';

const config: ClientConfig = {
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  apiVersion: '2026-10-01',
  perspective: 'published',
  useCdn: false,
};

export default config;
