import { ClientConfig } from 'next-sanity';
import sanityConfig from '../../sanity.json';

const config: ClientConfig = {
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || sanityConfig.api.projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || sanityConfig.api.dataset,
  apiVersion: '2021-06-06',
  useCdn: process.env.NEXT_PUBLIC_SANITY_USE_CDN === 'true',
};

export default config;
