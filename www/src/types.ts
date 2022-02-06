import { SanityImageAssetDocument } from '@sanity/client';
import { PortableTextBlock } from '@portabletext/types';

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
  textBody: PortableTextBlock[];
  description: string;
  images: { asset: SanityImageAssetDocument }[];
  categories: Category[];
  credits?: string;
  _id: string;
} & ProjectData;

type ProjectData = {
  assignment?: string;
  location?: string;
  clients?: string[];
  size?: string;
  collaborators?: string[];
  year?: string;
  awards?: string[];
};

type Path = {
  current: string;
};

export type Settings = {
  title: string;
  contactEmail?: string;
  featuredProjects?: Project[];
  categoriesOrder: Category[];
  logotype: SanityImageAssetDocument;
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
  textContent: string;
  pageContent: PortableTextBlock[];
  images: { asset: SanityImageAssetDocument }[];
};
