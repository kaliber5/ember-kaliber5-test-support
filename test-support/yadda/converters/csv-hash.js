/**
 *
 * Yadda dictionary converter for importing csv data with the first row containing column names, and returning a hash of it
 *
 * @public
 */
export default function yaddaCsvHashConverter(value, next) {
  let rows = value.split('\n');
  let seperator = rows[0].indexOf('|') !== -1 ? '|' : ',';
  let keys = rows[0].split(seperator).map((cell) => cell.trim());

  let result = rows.slice(1).map((row) => {
    let values = row.split(seperator)
      .map((cell) => cell.trim())
      .map((cell) => {
        if (cell.match(/^\[.*\]$/) || cell.match(/^\{.*\}$/)) {
          return JSON.parse(cell);
        }
        if (cell === '') return undefined
        return cell;
      });
    let hash = {};
    keys.forEach((key, index) => {
      if (values[index] !== undefined) {
        hash[key] = values[index];
      }
    });
    return hash;
  });
  next(null, result);
}