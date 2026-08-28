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
    return Object.entries(fields).map(([name, value]) => ({
      name,
      value,
    }));
  }

  return [];
}

function formatFieldValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return value
      .map(function (item) {
        return item === null || item === undefined ? '' : String(item).replace(/\r\n/g, '\n');
      })
      .filter(Boolean)
      .join('\n');
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
      return entry.name === fieldName && formatFieldValue(entry.value);
    });

    if (field) {
      if (Array.isArray(field.value)) {
        return String(field.value[0]);
      }

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
