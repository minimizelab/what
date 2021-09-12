import { SanityImageAssetDocument } from '@sanity/client';

export type Category = {
  path: Path;
  title: string;
  _id: string;
};
export type Project = {
  title: string;
  path: Path;
  subTitle?: string;
  mainImage?: SanityImageAssetDocument;
  description: string;
  content: any;
  category: Category;
  _id: string;
};

type Path = {
  current: string;
};
