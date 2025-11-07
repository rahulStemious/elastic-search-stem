const _ = require('lodash');

function toSnakeCase(obj) {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj && typeof obj === 'object')
    return Object.entries(obj).reduce((acc, [k, v]) => {
      acc[_.snakeCase(k)] = toSnakeCase(v);
      return acc;
    }, {});
  return obj;
}

module.exports = { toSnakeCase };
