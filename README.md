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

## Form fields as Trello card table

Use `formatFormFieldsAsTable` to render submitted form fields into a Markdown table suitable for a Trello card description.

## CI/CD deployment

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

- Pull request commits automatically run a **staging** deployment job.
- Pushes to `main` automatically run a **production** deployment job.

### Required GitHub Actions secrets

- `CLASP_CREDENTIALS_JSON`: JSON content for the `.clasprc.json` credentials file.
- `GOOGLE_SCRIPT_ID`: The target Apps Script project ID.
