import sanityConfig from '../../sanity.json';

const config = {
  sanity: {
    projectId:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || sanityConfig.api.projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || sanityConfig.api.dataset,
    apiVersion: '2019-01-29',
    useCdn: process.env.NODE_ENV === 'production',
  },
};

export default config;
