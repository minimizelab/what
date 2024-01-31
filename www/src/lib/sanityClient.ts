import { createClient } from 'next-sanity';
import config from './config';

export const client = createClient(config);

export const getClient = () => client;
