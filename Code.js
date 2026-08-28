function onFormSubmit(e) {
  if (!e || !e.namedValues) {
    throw new Error("Form submission event payload is missing namedValues.");
  }

  const props = PropertiesService.getScriptProperties();
  const key = getRequiredProperty_(props, "TRELLO_KEY");
  const token = getRequiredProperty_(props, "TRELLO_TOKEN");
  const sheetName = getSheetName_(e);
  const listId = getListIdForSheet_(props, sheetName);

  const responses = e.namedValues;
  const title = buildCardTitle_(responses, `New form submission (${sheetName})`);
  const description = buildDescription_(responses);

  UrlFetchApp.fetch("https://api.trello.com/1/cards", {
    method: "post",
    payload: {
      key,
      token,
      idList: listId,
      name: title,
      desc: description,
    },
  });
}

function getRequiredProperty_(props, key) {
  const value = props.getProperty(key);
  if (!value) {
    throw new Error(`Missing required script property: ${key}`);
  }
  return value;
}

function getSheetName_(e) {
  if (e.range && e.range.getSheet) {
    return e.range.getSheet().getName();
  }
  return "default";
}

function getListIdForSheet_(props, sheetName) {
  const raw = getRequiredProperty_(props, "TRELLO_LIST_IDS");

  let listIds;
  try {
    listIds = JSON.parse(raw);
  } catch (err) {
    throw new Error("TRELLO_LIST_IDS must be valid JSON.");
  }

  const listId = listIds[sheetName] || listIds.default;
  if (!listId) {
    throw new Error(
      `No Trello list id configured for sheet "${sheetName}" in TRELLO_LIST_IDS.`
    );
  }

  return listId;
}

function getFirstResponse_(responses, fieldNames) {
  for (let i = 0; i < fieldNames.length; i += 1) {
    const field = fieldNames[i];
    if (responses[field] && responses[field][0]) {
      return responses[field][0];
    }
  }
  return "";
}

function buildCardTitle_(responses, fallbackTitle) {
  const title = getFirstResponse_(responses, ["Title", "Name"]);
  const yourName = getFirstResponse_(responses, ["Your Name"]);

  if (yourName) {
    if (!title) {
      return yourName;
    }

    if (title !== yourName) {
      return `${title} - ${yourName}`;
    }
  }

  return title || fallbackTitle;
}

function buildDescription_(responses) {
  const rows = [];
  Object.keys(responses).forEach((question) => {
    const answer = responses[question] && responses[question][0]
      ? responses[question][0]
      : "";
    rows.push(formatFieldBlock_(question, answer));
  });
  return rows.join("\n\n");
}

function formatFieldBlock_(question, answer) {
  const formattedAnswer = formatFieldValue_(answer);

  if (!formattedAnswer) {
    return `**${question}**`;
  }

  return `**${question}**\n${formattedAnswer}`;
}

function formatFieldValue_(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/\r\n/g, "\n");
}
