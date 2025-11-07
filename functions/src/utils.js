/**
 * Parses INDEXED_FIELDS param like:
 * "firstName::first_name,lastName::last_name,email"
 * → { firstName: "first_name", lastName: "last_name", email: "email" }
 */
function parseKeyMappings() {
  const mappingStr = process.env.INDEXED_FIELDS || '';
  const mappings = {};

  mappingStr.split(',').forEach(pair => {
    if (!pair.trim()) return;
    const [from, to] = pair.split('::').map(s => s.trim());
    mappings[from] = to || from;
  });

  return mappings;
}

/**
 * Filters and renames keys in the given data object.
 */
function mapAllowedKeys(data) {
  const mappings = parseKeyMappings();
  const filtered = {};

  for (const [sourceKey, targetKey] of Object.entries(mappings)) {
    if (data[sourceKey] !== undefined) {
      filtered[targetKey] = data[sourceKey];
    }
  }

  return filtered;
}

module.exports = { mapAllowedKeys };
