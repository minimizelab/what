import { createClient } from '@sanity/client';
import config from './config';

export const client = createClient(config.sanity);

export const previewClient = createClient({
  ...config.sanity,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const getClient = (usePreview: boolean) =>
  usePreview ? previewClient : client;
