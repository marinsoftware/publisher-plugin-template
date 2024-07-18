/**
 * Filters an object array for a specific key/values
 * @param {object[]} objects
 * @param {object} filter
 * @return {object[]}
 */
function filter(objects: object[], filter: object): object[] {
  return objects.filter(function(obj) {
    return Object.keys(this).every((key) => obj[key] === this[key]);
  }, filter);
}

export { filter }
