function normalizeFields(fields) {
  if (!fields) {
    return [];
  }

  if (Array.isArray(fields)) {
    return fields
      .filter((field) => field && typeof field.name === 'string')
      .map((field) => ({ name: field.name, value: normalizeValue(field.value) }));
  }

  if (typeof fields === 'object') {
    return Object.entries(fields).map(([name, value]) => ({
      name,
      value: normalizeValue(value),
    }));
  }

  return [];
}

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function formatFieldValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).replace(/\r\n/g, '\n');
}

function formatFormFieldsAsMarkdown(fields) {
  var normalized = normalizeFields(fields);

  if (normalized.length === 0) {
    return '';
  }

  var rows = normalized.map(function (field) {
    var value = formatFieldValue(field.value);

    if (!value) {
      return '**' + field.name + '**';
    }

    return '**' + field.name + '**\n' + value;
  });

  return rows.join('\n\n');
}

function buildCardTitle(fields, fallbackTitle) {
  var normalized = normalizeFields(fields);
  var title = getFieldValue(normalized, ['Title', 'Name']);
  var yourName = getFieldValue(normalized, ['Your Name']);

  if (yourName) {
    if (!title) {
      return yourName;
    }

    if (title !== yourName) {
      return title + ' - ' + yourName;
    }
  }

  return title || fallbackTitle || '';
}

function getFieldValue(fields, names) {
  for (var i = 0; i < names.length; i += 1) {
    var fieldName = names[i];
    var field = fields.find(function (entry) {
      return entry.name === fieldName && entry.value;
    });

    if (field) {
      return String(field.value);
    }
  }

  return '';
}

module.exports = {
  buildCardTitle,
  formatFormFieldsAsMarkdown,
  formatFormFieldsAsTable: formatFormFieldsAsMarkdown,
};
