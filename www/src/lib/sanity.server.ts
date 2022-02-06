import sanityClient from '@sanity/client';
import config from './config';

export const client = sanityClient(config.sanity);

export const previewClient = sanityClient({
  ...config.sanity,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const getClient = (usePreview: boolean) =>
  usePreview ? previewClient : client;
