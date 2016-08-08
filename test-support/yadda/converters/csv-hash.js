/**
 *
 * Yadda dictionary converter for importing csv data with the first row containing column names, and returning a hash of it
 *
 * @public
 */
export default function yaddaCsvHashConverter(value, next) {
  let rows = value.split('\n');
  let keys = rows[0].split(',').map((cell) => cell.trim());

  let result = rows.slice(1).map((row) => {
    let values = row.split(',').map((cell) => cell.trim());
    let hash = {};
    keys.forEach((key, index) => {
      hash[key] = values[index];
    });
    return hash;
  });
  next(null, result);
}