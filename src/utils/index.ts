const isToday = (date: Date) => {
  const today = new Date();
  return today.toDateString() === date.toDateString();
};

const mergeArraysByKey = (a1: any[], a2: any[], key: string) => {
  const res = a1.concat(a2).reduce((acc, x) => {
    acc[x[key]] = Object.assign(acc[x[key]] || {}, x);
    return acc;
  }, {});

  return Object.entries(res).map((pair) => {
    const [, value] = pair;
    return value;
  }) as [any];
};

const dateTimeSortFunc = (a: any, b: any) => {
  if (a.datetime < b.datetime) {
    return -1;
  }
  if (a.datetime > b.datetime) {
    return 1;
  }
  return 0;
};

export { isToday, mergeArraysByKey, dateTimeSortFunc };
