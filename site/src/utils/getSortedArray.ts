const getSortedArray = <T extends { _id: string }>(
  all: T[],
  sorted?: T[]
): T[] => {
  if (!sorted) return all;
  const sortedIds = sorted.map((item) => item._id);
  const allNonSorted = all.filter((item) => !sortedIds.includes(item._id));
  return [...sorted, ...allNonSorted];
};

export default getSortedArray;
