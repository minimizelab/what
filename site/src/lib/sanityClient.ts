import { createClient } from '@sanity/client';
import config from './config';

export const client = createClient(config);
