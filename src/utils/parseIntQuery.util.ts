export function parseIntQuery(parseVal: any, defaultVal: number): number {
  if (!parseVal) {
    parseVal = defaultVal;
  } else {
    if (parseInt(parseVal)) {
      parseVal = parseInt(parseVal);
    } else {
      parseVal = defaultVal;
    }
  }

  return parseVal;
}
