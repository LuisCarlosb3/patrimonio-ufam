// eslint-disable-next-line
export const filterData = (list: any[], itemSearch: string, search: string) => {
  // eslint-disable-next-line
  const filteredList = list.filter((item: any) => {
    return item[itemSearch].toLowerCase().includes(search.toLowerCase());
  });

  return filteredList;
};
