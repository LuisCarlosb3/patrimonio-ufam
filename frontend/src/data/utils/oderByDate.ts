// eslint-disable-next-line
export const orderDataByDate = (data: any, value: string): any => {
  // eslint-disable-next-line
  const res = data.sort(function (a: any, b: any) {
    return b[value].localeCompare(a[value]);
  });

  return res;
};
