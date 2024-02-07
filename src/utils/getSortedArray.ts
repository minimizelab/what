const getSortedArray = <T extends { _id: string }>(
  all: T[],
  sorted?: T[]
): T[] => {
  if (!sorted) return all;
  const sortedIds = sorted.map((proj) => proj._id);
  const allNonSorted = all.filter((proj) => !sortedIds.includes(proj._id));
  return [...sorted, ...allNonSorted];
};

export default getSortedArray;
