
const staticMapping = {
  first: 0,
  '1st': 0,
  second: 1,
  '2nd': 1,
  third: 2,
  '3rd': 2
};

/**
 * Simple yadda dictionary converter for mapping names like first, second etc. to numeric indices
 * Returned indices are beginning with 0, so mapping is like this:
 * first -> 0
 * second -> 1
 * 5th -> 4
 *
 * @public
 */
export default function yaddaIndexMappingConverter(value, next) {
  let mapping = staticMapping[value];
  if (mapping !== undefined) {
    return next(null, mapping);
  }

  // map 4th -> 4 etc.
  let matches = value.match(/(\d)+th/);
  if (matches) {
    return next(null, matches[1] - 1);
  }

  return next(null, parseInt(value));
}