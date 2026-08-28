function normalizeFields(fields) {
  if (!fields) {
    return [];
  }

  if (Array.isArray(fields)) {
    return fields
      .filter((field) => field && typeof field.name === 'string')
      .map((field) => ({ name: field.name, value: field.value }));
  }

  if (typeof fields === 'object') {
    return Object.entries(fields).map(([name, value]) => ({ name, value }));
  }

  return [];
}

function escapeTableCell(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br>');
}

function formatFormFieldsAsTable(fields) {
  var normalized = normalizeFields(fields);

  if (normalized.length === 0) {
    return '';
  }

  var rows = normalized.map(function (field) {
    return '| ' + escapeTableCell(field.name) + ' | ' + escapeTableCell(field.value) + ' |';
  });

  return ['| Field | Response |', '| --- | --- |'].concat(rows).join('\n');
}

module.exports = {
  formatFormFieldsAsTable,
};
