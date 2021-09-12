export type Category = {
  path: Path;
  title: string;
  _id: string;
};
export type Project = {
  title: string;
  path: Path;
  subtitle?: string;
  description: string;
  _id: string;
};

type Path = {
  current: string;
};
