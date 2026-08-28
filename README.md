# google-form-to-trello

A Google Form Add-On that securely posts Google Form responses to Trello as new cards.

## Setup

1. Add the script in `Code.js` to your Apps Script project connected to your form response sheet.
2. In **Script Properties**, set:
   - `TRELLO_KEY`
   - `TRELLO_TOKEN`
   - `TRELLO_LIST_IDS` (JSON map of sheet name to Trello list id), for example:
     ```json
     {
       "Form Responses 1": "6a90ce1b012b6ea8273ac07d",
       "default": "6a90ce1b012b6ea8273ac07d"
     }
     ```
3. Create an installable **On form submit** trigger for `onFormSubmit`.

Each sheet can use a unique list id through `TRELLO_LIST_IDS`, while reusing the same Trello API key/token.
