# Qwerty Learner Dictionary Updater

This directory contains a serverless function to fetch words from Eudic dictionary and update the custom dictionary used by Qwerty Learner. It's written in TypeScript with ES Modules syntax for better type safety and code organization.

## Features

1. **Dictionary Updates**: The function fetches words from Eudic and adds them to your custom dictionary
2. **Custom Dictionary**: The function maintains a custom dictionary at `/public/dicts/my-custom-dict.json`
3. **Serverless**: Designed to run as a Vercel serverless function, no continuous server needed
4. **TypeScript**: Uses TypeScript for type safety and better development experience
5. **Modern JavaScript**: Uses ES Modules syntax (import/export) for better code organization

## Setup

1. Customize the code in `index.ts` to match your specific Eudic API endpoints and response structure.

2. Set environment variables in your Vercel project:

   - `EUDIC_API_URL`: Your Eudic API endpoint URL
   - `EUDIC_API_KEY`: Your Eudic API key

3. Install dependencies:

   ```bash
   cd src-cron
   npm install
   ```

4. For local development, you can build the TypeScript code:
   ```bash
   npm run build
   ```

## Deployment on Vercel

The project is configured to deploy both the frontend and serverless function to Vercel:

1. The `vercel.json` file in the root directory configures both the static frontend build and the serverless function.
2. When deployed, Vercel will create a serverless function accessible at `/api/update-dictionary`.
3. Vercel automatically handles TypeScript compilation, so no separate build step is needed.

## Setting up a Cron Job for Daily Updates

Since Vercel doesn't provide built-in cron scheduling in all plans, you can use one of these methods:

### Option 1: Vercel Cron (if available in your plan)

If you have access to Vercel Cron, add this to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/update-dictionary",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Option 2: External Cron Service

Use a free external service to trigger your function daily:

1. **GitHub Actions**: Create a workflow that calls your API endpoint daily
2. **cron-job.org**: Set up a free account at cron-job.org to call your endpoint
3. **Google Cloud Scheduler**: Set up a scheduler to call your endpoint

Example GitHub Actions workflow (save as `.github/workflows/daily-update.yml`):

```yaml
name: Daily Dictionary Update

on:
  schedule:
    - cron: '0 0 * * *' # Run at midnight UTC daily

jobs:
  update-dictionary:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger dictionary update
        run: |
          curl -X POST https://your-vercel-app.vercel.app/api/update-dictionary
```

## Manual API Usage

You can manually trigger the dictionary update by sending a POST request to the API endpoint:

```
POST /api/update-dictionary
```

## Notes

- Make sure your Eudic API key has the necessary permissions to fetch word lists
- The function will only add new words and won't remove existing words from the dictionary
- The dictionary size is automatically updated in the UI when the dictionary is loaded
