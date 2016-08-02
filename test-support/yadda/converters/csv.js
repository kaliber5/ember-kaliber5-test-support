/**
 * Simple yadda dictionary converter for importing csv data
 *
 * @public
 */
export default function yaddaCsvConverter(value, next) {
  let result = value.split('\n').map((row) => row.split(',').map((cell) => cell.trim()));
  next(null, result);
}