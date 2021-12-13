import { SanityImageAssetDocument } from '@sanity/client';

export type Category = {
  path: Path;
  title: string;
  sortedProjects?: Project[];
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
  credits?: string;
  _id: string;
};

type Path = {
  current: string;
};

export type Settings = {
  title: string;
  contactEmail?: string;
  featuredProjects?: Project[];
};

export type Employee = {
  _id: string;
  email: string;
  name: string;
  phone: string;
  image: SanityImageAssetDocument;
  titles: string;
};

export type Studio = {
  title: string;
  employees: Employee[];
};
