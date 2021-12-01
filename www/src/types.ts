import { SanityImageAssetDocument } from '@sanity/client';

export type Category = {
  path: Path;
  title: string;
  _id: string;
};
export type Project = {
  title: string;
  path: Path;
  slug: string;
  subTitle: string;
  mainImage?: SanityImageAssetDocument;
  description: string;
  images: { asset: SanityImageAssetDocument }[];
  categories: Category[];
  _id: string;
};

type Path = {
  current: string;
};

export type Employee = {
  email: string;
  name: string;
  phone: string;
  image: SanityImageAssetDocument;
  titles: string;
};
