export type Category = {
  title: string;
  slug: string;
  id: string;
};
export type Project = {
  id: string;
  title: string;
  img: string;
  category?: Category;
  categorySlug: string;
  featured: boolean;
};
