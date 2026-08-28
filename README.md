# google-form-to-trello
A Google Form Add-On that can securely post all google form responses to trello as new cards.

## CI/CD deployment

This repository includes a GitHub Actions workflow at `/home/runner/work/google-form-to-trello/google-form-to-trello/.github/workflows/deploy.yml`.

- Pull request commits automatically run a **staging** deployment job.
- Pushes to `main` automatically run a **production** deployment job.

### Required GitHub Actions secrets

- `CLASP_CREDENTIALS_JSON`: JSON content for the `.clasprc.json` credentials file.
- `GOOGLE_SCRIPT_ID`: The target Apps Script project ID.
