export const parseQuery = (queryString: string) => {
  const returnValue: any = {};

  if (!queryString || queryString.length === 0) return "";

  const str = queryString[0] === "?" ? queryString.slice(1) : queryString;
  const paramPairs = str.split("&");

  paramPairs.forEach((pair: string) => {
    const [key, val] = pair.split("=");
    returnValue[decodeURIComponent(key)] = decodeURIComponent(val);
  });

  return returnValue;
};
