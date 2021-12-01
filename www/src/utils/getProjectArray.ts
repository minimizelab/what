import { Project } from '../types';

const getProjectArray = (all: Project[], sorted?: Project[]): Project[] => {
  if (!sorted) return all;
  const sortedIds = sorted.map((proj) => proj._id);
  const allNonSorted = all.filter((proj) => !sortedIds.includes(proj._id));
  return [...sorted, ...allNonSorted];
};

export default getProjectArray;
