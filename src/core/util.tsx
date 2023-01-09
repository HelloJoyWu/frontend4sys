export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Date traosform to string YYYY-MM-DD.
 * If theDate is not given return today.
 * @param theDate Date
 * @returns
 */
export const toDateString = (
  theDate: Date | null | undefined = null,
): string => {
  if (!theDate) {
    theDate = new Date();
  }
  const yearText = theDate.getFullYear().toString();
  let monthText = (theDate.getMonth() + 1).toString();
  if (monthText.length === 1) {
    monthText = '0' + monthText;
  }
  let dayText = theDate.getDate().toString();
  if (dayText.length === 1) {
    dayText = '0' + dayText;
  }

  return yearText + '-' + monthText + '-' + dayText;
};

export const objToQueryString = (obj: {
  [k: string]: string | number | boolean | null | undefined;
}) => {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(key + '=' + obj[key]);
  }
  return keyValuePairs.join('&');
};
