const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildCardTitle,
  formatFormFieldsAsMarkdown,
  formatFormFieldsAsTable,
} = require('../src/trelloCardFormatter');

test('formats object input as markdown field blocks', () => {
  const result = formatFormFieldsAsMarkdown({
    Name: 'Ada Lovelace',
    Role: 'Engineer',
  });

  assert.equal(
    result,
    [
      '**Name**',
      'Ada Lovelace',
      '',
      '**Role**',
      'Engineer',
    ].join('\n')
  );
});

test('preserves pipes and newlines in values', () => {
  const result = formatFormFieldsAsMarkdown([
    { name: 'Question | one', value: 'line 1\nline | 2' },
  ]);

  assert.equal(
    result,
    [
      '**Question | one**',
      'line 1',
      'line | 2',
    ].join('\n')
  );
});

test('normalizes response arrays and keeps backslashes', () => {
  const result = formatFormFieldsAsMarkdown({
    'Path \\ name': ['C:\\temp\\file.txt'],
  });

  assert.equal(result, ['**Path \\ name**', 'C:\\temp\\file.txt'].join('\n'));
});

test('retains the legacy export as an alias', () => {
  const result = formatFormFieldsAsTable([
    { name: 'Path \\ name', value: 'C:\\temp\\file.txt' },
  ]);

  assert.equal(result, ['**Path \\ name**', 'C:\\temp\\file.txt'].join('\n'));
});

test('returns empty string for empty input', () => {
  assert.equal(formatFormFieldsAsMarkdown({}), '');
  assert.equal(formatFormFieldsAsMarkdown([]), '');
  assert.equal(formatFormFieldsAsMarkdown(null), '');
});

test('appends "Your Name" to the card title when present', () => {
  assert.equal(
    buildCardTitle(
      {
        Title: 'Quarterly planning',
        'Your Name': 'Ada Lovelace',
      },
      'Fallback title'
    ),
    'Quarterly planning - Ada Lovelace'
  );
});

test('uses "Your Name" as the title when no other title exists', () => {
  assert.equal(
    buildCardTitle(
      {
        'Your Name': 'Ada Lovelace',
      },
      'Fallback title'
    ),
    'Ada Lovelace'
  );
});

test('falls back to the provided title when no title fields exist', () => {
  assert.equal(buildCardTitle({}, 'Fallback title'), 'Fallback title');
});
