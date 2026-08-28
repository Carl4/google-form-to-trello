const test = require('node:test');
const assert = require('node:assert/strict');

const { formatFormFieldsAsTable } = require('../src/trelloCardFormatter');

test('formats object input as a markdown table', () => {
  const result = formatFormFieldsAsTable({
    Name: 'Ada Lovelace',
    Role: 'Engineer',
  });

  assert.equal(
    result,
    [
      '| Field | Response |',
      '| --- | --- |',
      '| Name | Ada Lovelace |',
      '| Role | Engineer |',
    ].join('\n')
  );
});

test('escapes pipes and newlines in values', () => {
  const result = formatFormFieldsAsTable([
    { name: 'Question | one', value: 'line 1\nline | 2' },
  ]);

  assert.equal(
    result,
    [
      '| Field | Response |',
      '| --- | --- |',
      '| Question \\| one | line 1<br>line \\| 2 |',
    ].join('\n')
  );
});

test('escapes backslashes in names and values', () => {
  const result = formatFormFieldsAsTable([
    { name: 'Path \\ name', value: 'C:\\temp\\file.txt' },
  ]);

  assert.equal(
    result,
    [
      '| Field | Response |',
      '| --- | --- |',
      '| Path \\\\ name | C:\\\\temp\\\\file.txt |',
    ].join('\n')
  );
});

test('returns empty string for empty input', () => {
  assert.equal(formatFormFieldsAsTable({}), '');
  assert.equal(formatFormFieldsAsTable([]), '');
  assert.equal(formatFormFieldsAsTable(null), '');
});
